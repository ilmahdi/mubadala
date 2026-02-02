/**
 * Hero Section Component
 * Main landing page hero with value proposition and CTA
 */

'use client';

import { ArrowRight, TrendingUp, Globe2, BarChart3 } from 'lucide-react';
import { SignInButton } from '@/src/components/auth/SignInButton';
import { useAuth } from '@/src/hooks/use-auth';
import Link from 'next/link';

export function Hero() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-blue-50/30">
      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-linear-to-br from-red-100/40 to-pink-100/40 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-linear-to-br from-blue-100/40 to-purple-100/40 blur-3xl" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(17, 24, 39) 1px, transparent 1px), linear-gradient(to bottom, rgb(17, 24, 39) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-gray-200/80 bg-white px-5 py-2.5 shadow-sm ring-1 ring-gray-900/5 backdrop-blur-sm transition-all hover:border-gray-300 hover:shadow-md">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--color-brand-primary-alpha-10)' }}
            >
              <TrendingUp
                className="h-3 w-3"
                style={{ color: 'var(--color-brand-primary)' }}
              />
            </div>
            <span className="text-xs font-semibold tracking-widest text-gray-700 uppercase">
              Trade Analytics Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-5xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-6xl sm:leading-tight lg:text-7xl lg:leading-tight">
            Unlock Global Trade{' '}
            <span
              className="relative inline-block"
              style={{
                background:
                  'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Insights
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed font-normal text-gray-600 sm:text-2xl sm:leading-relaxed">
            Analyze trade data across continents with powerful filters,
            real-time search, and comprehensive analytics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            {isLoading ? (
              <div className="h-14 w-56 animate-pulse rounded-xl bg-gray-200" />
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="group focus:ring-brand inline-flex h-14 items-center gap-2.5 rounded-xl px-8 py-0 text-base font-bold text-white shadow-xl transition-all hover:shadow-2xl focus:ring-2 focus:ring-offset-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
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
              <SignInButton
                className="group relative inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-xl px-9 py-0 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:outline-none"
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--color-brand-primary-hover)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--color-brand-primary)';
                }}
              />
            )}

            <a
              href="#features"
              className="group inline-flex h-14 items-center gap-2.5 rounded-xl border-2 border-gray-300 bg-white px-9 py-0 text-base font-semibold text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById('features')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
              <div className="relative">
                <div
                  className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-brand-primary-alpha-10)',
                  }}
                >
                  <Globe2
                    className="h-7 w-7"
                    style={{ color: 'var(--color-brand-primary)' }}
                  />
                </div>
                <div className="mb-2 text-4xl font-bold text-gray-900">
                  200
                  <span style={{ color: 'var(--color-brand-primary)' }}>+</span>
                </div>
                <div className="text-sm font-medium tracking-wide text-gray-600 uppercase">
                  Countries Tracked
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
              <div className="relative">
                <div
                  className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-brand-primary-alpha-10)',
                  }}
                >
                  <BarChart3
                    className="h-7 w-7"
                    style={{ color: 'var(--color-brand-primary)' }}
                  />
                </div>
                <div className="mb-2 text-4xl font-bold text-gray-900">
                  1M
                  <span style={{ color: 'var(--color-brand-primary)' }}>+</span>
                </div>
                <div className="text-sm font-medium tracking-wide text-gray-600 uppercase">
                  Trade Records
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
              <div className="relative">
                <div
                  className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: 'var(--color-brand-primary-alpha-10)',
                  }}
                >
                  <TrendingUp
                    className="h-7 w-7"
                    style={{ color: 'var(--color-brand-primary)' }}
                  />
                </div>
                <div className="mb-2 text-4xl font-bold text-gray-900">
                  Real
                  <span style={{ color: 'var(--color-brand-primary)' }}>-</span>
                  time
                </div>
                <div className="text-sm font-medium tracking-wide text-gray-600 uppercase">
                  Data Updates
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
