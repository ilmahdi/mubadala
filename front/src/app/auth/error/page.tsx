/**
 * Authentication error page.
 *
 * Displays authentication errors with retry options.
 */
'use client';

import { useSearchParams } from 'next/navigation';
import { SignInButton } from '@/src/components/auth/SignInButton';
import { cardStyles, textStyles } from '@/src/config/component-styles';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification:
      'The verification token has expired or has already been used.',
    Default: 'An error occurred during authentication. Please try again.',
  };

  const message = errorMessages[error || ''] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className={`${cardStyles.default} w-full max-w-md`}>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>

          <h1 className={`${textStyles.heading.h4} mb-2`}>
            Authentication Error
          </h1>

          <p className={`${textStyles.body.default} text-gray-600`}>
            {message}
          </p>
        </div>

        <SignInButton className="w-full" callbackUrl="/" />
      </div>
    </div>
  );
}
