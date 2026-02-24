/**
 * Smooth Scroll Provider
 * Wraps the landing page with Lenis for premium inertia scrolling.
 */

'use client';

import ReactLenis from 'lenis/react';

const LENIS_OPTIONS = {
  duration: 1.15,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,
};

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
