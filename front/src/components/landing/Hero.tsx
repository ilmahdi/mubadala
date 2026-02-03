/**
 * Hero Section Component
 * Main landing page hero with value proposition and CTA
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/src/hooks/use-auth';
import { ArrowRight, CheckCircle, Lock } from 'lucide-react';

export function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden bg-white px-6 pt-28 pb-20 lg:px-10"
      id="overview"
    >
      {/* Decorative hero image (behind content) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/morocco-map-hero.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top-right opacity-70"
          priority
        />

        {/* dark readability overlay */}
        <div className="absolute inset-0 bg-white/70" />

        {/* directional gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-white via-white/70 to-white/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-240 flex-col items-center gap-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: 'var(--color-brand-primary)' }}
          />
          <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
            Morocco&apos;s Premier Trade Intelligence
          </span>
        </div>

        {/* Headline */}
        <div className="flex max-w-4xl flex-col gap-6">
          <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
            Explore Morocco&apos;s
            <br />
            Trade <span className="text-brand">Statistics</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-gray-600 md:text-xl">
            Navigate comprehensive import & export statistics with ease. Analyze
            trade records, volume flows, and{' '}
            <span className="rounded bg-gray-100 px-1 font-mono text-base">
              HS Code
            </span>{' '}
            transactions with a modern interface built for speed.
          </p>
        </div>

        {/* CTA Button */}
        <div className="relative z-10 flex w-full flex-col items-center gap-6 pt-4">
          <Link
            href="/dashboard"
            className="bg-brand hover:bg-brand-dark flex h-14 transform items-center justify-center gap-2 rounded-lg px-10 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Access'}</span>

            <ArrowRight size={20} strokeWidth={2} />
          </Link>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle
                className="text-gray-400"
                size={16}
                strokeWidth={2}
              />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="text-gray-400" size={16} strokeWidth={2} />
              <span>Secure login</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
