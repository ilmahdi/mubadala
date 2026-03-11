/**
 * Authentication context provider for managing user session state.
 *
 * Wraps the application with NextAuth's SessionProvider so any child
 * component can call `useSession()` or `useAuth()`.
 *
 * `refetchOnWindowFocus` is enabled so the session (and the Backend access
 * token inside it) is refreshed whenever the user returns to the tab.
 *
 * `TokenSyncer` runs inside the provider so the api.ts module variable is
 * always up to date, even from non-hook call sites (e.g. service functions).
 */
'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { useAuth } from '@/src/hooks/use-auth';

/** Inner component that ensures the token is synced via useAuth. */
function TokenSyncer() {
  useAuth();
  return null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={5 * 60}>
      <TokenSyncer />
      {children}
    </SessionProvider>
  );
}
