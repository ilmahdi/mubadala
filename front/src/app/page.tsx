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
  SmoothScrollProvider,
} from '@/src/components/landing';

export default function Home() {
  return (
    <SmoothScrollProvider>
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
    </SmoothScrollProvider>
  );
}
