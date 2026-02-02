/**
 * Extended type definitions for NextAuth.js.
 *
 * Adds custom properties to Session and JWT types.
 */
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
    accessToken?: string;
    idToken?: string;
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
    accessToken?: string;
    idToken?: string;
    provider?: string;
    picture?: string;
  }
}
