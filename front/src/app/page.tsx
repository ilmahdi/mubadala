/**
 * Landing Page
 * Main entry point with marketing content and sign-in CTA
 */

'use client';

import {
  Hero,
  Features,
  CTA,
  LandingFooter,
  LandingHeader,
} from '@/src/components/landing';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  );
}
