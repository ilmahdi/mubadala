/**
 * Authentication configuration for NextAuth.js v5.
 *
 * Handles Google OAuth authentication and session management.
 */
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
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
    async jwt({ token, account, profile }) {
      // Persist OAuth tokens and user info
      if (account && profile) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.provider = account.provider;
        token.picture = profile.picture;
        token.email = profile.email;
        token.name = profile.name;
      }
      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.image = token.picture as string;
        session.accessToken = token.accessToken as string;
        session.idToken = token.idToken as string;
      }
      return session;
    },

    async signIn({ account, profile }) {
      // Verify email is verified with Google
      if (account?.provider === 'google') {
        if (profile?.email_verified !== true) {
          return false;
        }

        // Sync user with Django backend
        try {
          const apiUrl = process.env.NEXT_INTERNAL_API_BASE_URL;
          const response = await fetch(`${apiUrl}/api/auth/sync-google-user/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              google_id: profile.sub,
              picture: profile.picture,
            }),
          });

          if (!response.ok) {
            console.error(
              'Failed to sync user with backend:',
              await response.text(),
            );
            // Still allow sign-in even if backend sync fails
          } else {
            const data = await response.json();
            console.log('User synced with backend:', data.message);
          }
        } catch (error) {
          console.error('Error syncing user with backend:', error);
          // Still allow sign-in even if backend sync fails
        }

        return true;
      }
      return true;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
