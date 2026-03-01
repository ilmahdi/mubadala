/**
 * Custom hook for authentication utilities.
 *
 * Returns session state and the Backend JWT access token sourced directly from
 * the NextAuth session.  No token is ever written to localStorage or
 * sessionStorage — the encrypted HttpOnly cookie managed by NextAuth is the
 * single source of truth.
 *
 * Additionally syncs the token into the `api.ts` module-level variable so
 * imperative API calls (outside React components) always use a fresh token.
 */
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setBackendAccessToken } from '@/src/lib/api';

export function useAuth() {
  const { data: session, status } = useSession();

  // Keep the api.ts module variable in sync with the current session token
  useEffect(() => {
    setBackendAccessToken(session?.backendAccessToken ?? null);
  }, [session?.backendAccessToken]);

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
    /** Backend JWT access token — attach as `Authorization: Bearer <token>` */
    backendAccessToken: session?.backendAccessToken ?? null,
  };
}
