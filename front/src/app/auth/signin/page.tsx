/**
 * Sign-in page.
 *
 * Provides Google OAuth authentication interface.
 */
import Image from 'next/image';
import Link from 'next/link';
import { ChartArea, ShieldCheck } from 'lucide-react';
import { SignInButton } from '@/src/components/auth/SignInButton';
import { textStyles, separatorStyles } from '@/src/config/component-styles';

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/morocco-map-hero.png"
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
          <div className="text-brand-primary flex h-9 w-9 items-center justify-center">
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
              <ChartArea className="text-error-600" size={22} strokeWidth={2} />
            </div>

            <h1 className={`${textStyles.heading.h4} mb-1.5`}>Welcome back</h1>
            <p className={`${textStyles.body.small} text-gray-500`}>
              Sign in to access Morocco&apos;s trade intelligence platform
            </p>
          </div>

          <div className={`${separatorStyles.horizontal} mb-6`} />

          <SignInButton className="w-full" callbackUrl="/dashboard" />

          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} strokeWidth={2} />
              Secure OAuth
            </span>
          </div>
        </div>

        <p className={`${textStyles.caption} mt-5 text-center text-gray-400`}>
          By signing in you agree to our{' '}
          <span className="cursor-pointer underline underline-offset-2 transition-colors hover:text-gray-600">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="cursor-pointer underline underline-offset-2 transition-colors hover:text-gray-600">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}
