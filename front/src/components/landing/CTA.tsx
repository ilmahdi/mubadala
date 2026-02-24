/**
 * Call-to-Action Section Component
 * Final conversion section encouraging sign-up
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, SquareArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24">
      <div className="relative z-10 flex justify-center">
        <motion.div
          className="relative flex w-full max-w-300 flex-col items-center gap-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center md:p-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Morocco Pattern Background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c1272d' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-4">
            <span className="text-brand text-xs font-bold tracking-[0.15em] uppercase">
              Get Started
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Ready to explore Morocco&apos;s foreign trade data?
            </h2>
            <p className="text-lg leading-relaxed font-light text-gray-600">
              Filter, sort, and export millions of official trade records — no
              setup required.
            </p>
          </div>

          {/* CTA */}
          <div className="relative z-10 flex w-full flex-col items-center gap-5">
            <Link
              href="/dashboard"
              className="bg-brand hover:bg-brand-dark flex h-14 transform items-center justify-center gap-2 rounded-lg px-10 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
            >
              <span>Get Access Now</span>
              <ArrowRight size={20} strokeWidth={2} />
            </Link>

            {/* Trust Indicators */}
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
