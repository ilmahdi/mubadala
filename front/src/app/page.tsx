/**
 * Landing Page
 * Main entry point with marketing content and sign-in CTA
 */

'use client';

import {
  Hero,
  DataCoverage,
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
        <DataCoverage />
        <Features />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  );
}
