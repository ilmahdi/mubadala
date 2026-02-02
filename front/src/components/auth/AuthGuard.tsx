/**
 * Authentication guard component for protected routes.
 *
 * Redirects unauthenticated users to sign-in page.
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
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="border-brand h-32 w-32 animate-spin rounded-full border-t-2 border-b-2"></div>
        </div>
      )
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
