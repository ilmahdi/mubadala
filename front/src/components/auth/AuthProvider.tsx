/**
 * Authentication context provider for managing user session state.
 *
 * Wraps the application with session management capabilities.
 */
'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
