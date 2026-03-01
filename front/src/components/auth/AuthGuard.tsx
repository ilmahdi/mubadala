/**
 * Authentication guard component for protected routes.
 *
 * Redirects unauthenticated users to the sign-in page.
 * Also redirects when the Backend token refresh has failed so the user can
 * re-authenticate instead of silently receiving 401 errors.
 */
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
      return;
    }
    // Force re-login when the background Backend token refresh has failed
    if (status === 'authenticated' && session?.error === 'RefreshTokenError') {
      router.replace('/auth/signin');
    }
  }, [status, session?.error, router]);

  if (status === 'loading') {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-brand h-16 w-16 animate-spin rounded-full border-t-2 border-b-2" />
        </div>
      )
    );
  }

  // Don't render children until we know the user is authenticated and the
  // token is healthy — avoids a brief flash of protected content.
  if (!session || session.error === 'RefreshTokenError') {
    return null;
  }

  return <>{children}</>;
}
