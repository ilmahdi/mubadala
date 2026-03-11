/**
 * Authentication error page.
 *
 * Displays authentication errors with retry options.
 */
'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChartArea, AlertTriangle } from 'lucide-react';
import { SignInButton } from '@/src/components/auth/SignInButton';
import { textStyles, separatorStyles } from '@/src/config/component-styles';

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server configuration error',
    description:
      'There is a problem with the authentication configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access denied',
    description:
      'Your account does not have permission to access this platform.',
  },
  Verification: {
    title: 'Link expired',
    description: 'The verification link has expired or has already been used.',
  },
  BackendSyncError: {
    title: 'Account sync failed',
    description:
      'Your Google account was verified but we could not sync it with our system. Please try again.',
  },
  RefreshTokenError: {
    title: 'Session expired',
    description: 'Your session has expired. Please sign in again to continue.',
  },
  Default: {
    title: 'Authentication error',
    description: 'Something went wrong during sign-in. Please try again.',
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error') ?? 'Default';
  const { title, description } =
    ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/morocco-map-hero.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-white/75" />
        <div className="absolute inset-0 bg-linear-to-t from-white via-white/60 to-white/40" />
      </div>

      <div className="absolute top-0 right-0 left-0 z-10 flex items-center px-6 py-4">
        <Link href="/" className="-m-1.5 flex items-center p-1.5">
          <div className="text-brand flex h-9 w-9 items-center justify-center">
            <ChartArea size={22} strokeWidth={2.8} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            Mubadala
          </span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-xl border border-gray-200 bg-white/90 p-8 shadow-lg backdrop-blur-sm">
          <div className="mb-7 text-center">
            <div className="border-error-100 bg-error-50 mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border">
              <AlertTriangle
                className="text-error-600"
                size={22}
                strokeWidth={2}
              />
            </div>

            <h1 className={`${textStyles.heading.h4} mb-1.5`}>{title}</h1>
            <p className={`${textStyles.body.small} text-gray-500`}>
              {description}
            </p>
          </div>

          <div className={`${separatorStyles.horizontal} mb-6`} />

          <SignInButton className="w-full" callbackUrl="/trades" />

          <div className="mt-4 text-center">
            <Link
              href="/"
              className={`${textStyles.body.small} text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-600`}
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
