/**
 * Extended type definitions for NextAuth.js.
 *
 * Adds custom properties to Session and JWT types.
 *
 * `backendAccessToken` — the Backend JWT access token, issued by the backend's
 * `sync-google-user` endpoint.  It is safe to expose to the client because it
 * is scoped to this app's API only (not the user's Google account).
 *
 * `error` — set to 'RefreshTokenError' when the Backend token could not be
 * refreshed. The middleware redirects the user to sign-in in that case.
 */
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
    /** Backend JWT access token — use this for Authorization: Bearer <token> */
    backendAccessToken: string | null;
    /** Set when token refresh fails; triggers re-authentication */
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendAccessTokenExpires?: number;
    provider?: string;
    picture?: string;
    error?: string;
  }
}
