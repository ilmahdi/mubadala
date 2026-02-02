/**
 * Custom hook for authentication utilities.
 *
 * Provides helper functions for managing auth tokens and session.
 */
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();

  // Sync session token to sessionStorage for API calls
  useEffect(() => {
    if (session?.accessToken) {
      sessionStorage.setItem('auth_token', session.accessToken);
    } else {
      sessionStorage.removeItem('auth_token');
    }
  }, [session]);

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
  };
}
