/**
 * Authentication configuration for NextAuth.js v5.
 *
 * Flow:
 *  1. User signs in with Google (OAuth consent screen).
 *  2. NextAuth `signIn` callback sends the verified Google profile to the
 *     Backend `sync-google-user` endpoint (server-to-server, protected by a
 *     shared secret).
 *  3. Backend creates/updates the user and returns a Backend JWT pair
 *     (access + refresh).
 *  4. The Backend tokens are stored in the encrypted NextAuth JWT cookie —
 *     never in localStorage/sessionStorage.
 *  5. `session` callback forwards the Backend access token to the client so
 *     React can attach it to API requests via `session.backendAccessToken`.
 *  6. The `jwt` callback proactively refreshes the Backend access token when
 *     it is within 60 seconds of expiry using the stored refresh token.
 */
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

// Backend JWT access tokens expire after 1 hour (3600 s).
// We refresh proactively 60 seconds before expiry.
const DJANGO_ACCESS_TOKEN_EXPIRY_SECONDS = 3600;
const REFRESH_BUFFER_SECONDS = 60;

/**
 * Exchange a Backend refresh token for a new access token.
 * Returns the new access token string, or null on failure.
 */
async function refreshBackendAccessToken(
  refreshToken: string,
): Promise<{ access: string; refresh: string } | null> {
  try {
    const apiUrl = process.env.NEXT_INTERNAL_API_BASE_URL;
    const res = await fetch(`${apiUrl}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      console.error('[auth] Backend token refresh failed:', res.status);
      return null;
    }

    const data = await res.json();
    return {
      access: data.access as string,
      // dj-rest-auth with ROTATE_REFRESH_TOKENS=True may return a new refresh token
      refresh: (data.refresh as string | undefined) ?? refreshToken,
    };
  } catch (err) {
    console.error('[auth] Backend token refresh error:', err);
    return null;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'online',
          response_type: 'code',
        },
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  callbacks: {
    /**
     * Called whenever a JWT is created or updated.
     * On first sign-in (`account` is present) we sync with Backend and store
     * the Backend JWT.  On subsequent calls we proactively refresh if needed.
     */
    async jwt({ token, account, profile }) {
      // ── Initial sign-in ──────────────────────────────────────────────────
      if (account && profile) {
        // The token will carry Backend credentials, not the raw Google tokens.
        token.provider = account.provider;
        token.picture = profile.picture as string | undefined;

        // Sync with Backend and obtain Backend JWT
        try {
          const apiUrl = process.env.NEXT_INTERNAL_API_BASE_URL;
          const secret = process.env.INTERNAL_API_SECRET;
          const res = await fetch(`${apiUrl}/api/auth/sync-google-user/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Shared secret — never sent to the browser
              'X-Internal-Secret': secret ?? '',
            },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              google_id: profile.sub,
              picture: profile.picture,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            token.backendAccessToken = data.access as string;
            token.backendRefreshToken = data.refresh as string;
            // Store expiry as a Unix timestamp (seconds)
            token.backendAccessTokenExpires =
              Math.floor(Date.now() / 1000) +
              DJANGO_ACCESS_TOKEN_EXPIRY_SECONDS;
          } else {
            const text = await res.text();
            console.error('[auth] Backend sync failed:', res.status, text);
            token.error = 'BackendSyncError';
          }
        } catch (err) {
          console.error('[auth] Backend sync error:', err);
          token.error = 'BackendSyncError';
        }
      }

      // ── Proactive token refresh ───────────────────────────────────────────
      const expiresAt = token.backendAccessTokenExpires as number | undefined;
      const refreshToken = token.backendRefreshToken as string | undefined;

      if (
        expiresAt &&
        refreshToken &&
        Math.floor(Date.now() / 1000) > expiresAt - REFRESH_BUFFER_SECONDS
      ) {
        const refreshed = await refreshBackendAccessToken(refreshToken);
        if (refreshed) {
          token.backendAccessToken = refreshed.access;
          token.backendRefreshToken = refreshed.refresh;
          token.backendAccessTokenExpires =
            Math.floor(Date.now() / 1000) + DJANGO_ACCESS_TOKEN_EXPIRY_SECONDS;
          delete token.error;
        } else {
          // Refresh failed — force re-login on next request
          token.error = 'RefreshTokenError';
        }
      }

      return token;
    },

    /**
     * Called whenever a session is accessed by the client.
     * Only safe, non-sensitive fields are forwarded.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.image = (token.picture as string | undefined) ?? undefined;
      }
      // Expose the Backend access token so the client can attach it to API
      // requests. The refresh token is intentionally kept server-side only.
      session.backendAccessToken = (token.backendAccessToken as string) ?? null;
      session.error = (token.error as string | undefined) ?? undefined;
      return session;
    },

    /**
     * Guard: only allow sign-in for Google accounts with a verified email.
     */
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return profile?.email_verified === true;
      }
      return true;
    },

    /**
     * Middleware-level authorization check.
     *
     * Rules:
     *  - Authenticated + /dashboard  → allow
     *  - Authenticated + / or /auth  → redirect to /dashboard
     *  - Unauthenticated + /dashboard → redirect to /auth/signin
     *  - RefreshTokenError            → redirect to /auth/signin
     *  - Everything else              → allow
     */
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      const isAuthenticated = !!session?.user;
      const isProtected = pathname.startsWith('/dashboard');
      const isAuthRoute = pathname.startsWith('/auth');
      const isLanding = pathname === '/';

      // Force re-login when the backend refresh token is invalid
      if (session?.error === 'RefreshTokenError') {
        return Response.redirect(
          new URL('/auth/signin', request.nextUrl.origin),
        );
      }

      // Redirect authenticated users away from landing page & auth routes
      if (isAuthenticated && (isLanding || isAuthRoute)) {
        return Response.redirect(new URL('/dashboard', request.nextUrl.origin));
      }

      // Redirect unauthenticated users away from protected routes
      if (isProtected && !isAuthenticated) {
        return Response.redirect(
          new URL('/auth/signin', request.nextUrl.origin),
        );
      }

      return true;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days (matches Backend refresh token lifetime)
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
