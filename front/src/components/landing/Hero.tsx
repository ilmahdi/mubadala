/**
 * Hero Section Component
 * Main landing page hero with value proposition and CTA
 */

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, SquareArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden bg-white px-6 py-20 lg:px-10"
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
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/10 px-4 py-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="bg-brand-primary h-1.5 w-1.5 rounded-full" />
          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Morocco Trade Intelligence Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="flex max-w-4xl flex-col gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Analyze Morocco&apos;s
            <br />
            Global
            <span className="text-brand"> Trade</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed font-light text-gray-500 lg:text-xl">
            Query millions of records across product hierarchies, partner
            countries, and time periods with advanced filtering and real-time
            performance.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="flex w-full flex-col items-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <Link
            href="/dashboard"
            className="bg-brand hover:bg-brand-dark flex h-14 transform items-center justify-center gap-2 rounded-lg px-10 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
          >
            <span>Get Access</span>
          </Link>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <SquareArrowRight
                className="text-gray-400"
                size={15}
                strokeWidth={2}
              />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck
                className="text-gray-400"
                size={15}
                strokeWidth={2}
              />
              <span>Secure login</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
