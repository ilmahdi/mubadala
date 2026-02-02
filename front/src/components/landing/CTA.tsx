/**
 * Call-to-Action Section Component
 * Final conversion section encouraging sign-up
 */

'use client';

import { ArrowRight } from 'lucide-react';
import { SignInButton } from '@/src/components/auth/SignInButton';
import { useAuth } from '@/src/hooks/use-auth';
import Link from 'next/link';

export function CTA() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Gradient orbs */}
      <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-linear-to-br from-red-900/30 to-pink-900/30 blur-3xl" />
      <div className="absolute right-1/4 -bottom-40 h-96 w-96 rounded-full bg-linear-to-br from-purple-900/30 to-blue-900/30 blur-3xl" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-5xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Ready to unlock{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, #fca5a5 0%, #f87171 50%, #ef4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              trade insights
            </span>
            ?
          </h2>
          <p className="mb-12 text-xl leading-relaxed text-gray-300 sm:text-2xl">
            Join thousands of professionals analyzing global trade data.
            <br className="hidden sm:block" />
            Get started in seconds with your Google account.
          </p>

          {/* CTA Button */}
          {isLoading ? (
            <div className="mx-auto h-14 w-64 animate-pulse rounded-xl bg-gray-700" />
          ) : isAuthenticated ? (
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 rounded-xl px-10 py-4 text-lg font-semibold shadow-xl transition-all hover:shadow-2xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--color-brand-primary-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--color-brand-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <SignInButton className="group inline-flex items-center gap-2.5 rounded-xl px-10 py-4 text-lg font-semibold shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none" />
          )}

          {/* Trust badges */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-base text-gray-300 sm:gap-10">
              <div className="flex items-center gap-2.5 transition-colors hover:text-white">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 transition-colors hover:text-white">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Free access</span>
              </div>
              <div className="flex items-center gap-2 transition-colors hover:text-white">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Instant setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
