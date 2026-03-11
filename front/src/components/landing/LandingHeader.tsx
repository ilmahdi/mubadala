/**
 * Landing Header Component
 * Simplified header for landing page with navigation and auth
 */

'use client';

import Link from 'next/link';
import { useLenis } from 'lenis/react';
import { ChartArea } from 'lucide-react';

export function LandingHeader() {
  const lenis = useLenis();

  const navigation = [
    { name: 'Data Coverage', href: '#coverage' },
    { name: 'Features', href: '#features' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-transparent bg-gray-50/20 shadow-xs backdrop-blur-lg backdrop-saturate-150 transition-colors">
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent ring-1 ring-white/10">
                <ChartArea className="text-brand" size={24} strokeWidth={2.8} />
              </div>
              <h2 className="text-text-primary text-xl font-semibold tracking-tight">
                Mubadala
              </h2>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-10 md:flex">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-brand rounded-md px-3 py-1 text-sm font-medium text-gray-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  lenis?.scrollTo(item.href, { duration: 1.4, offset: -80 });
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/trades"
              className="border-brand text-brand hover:bg-brand focus:ring-brand/40 rounded-lg border-[1.5px] px-4 py-1.5 text-sm font-medium transition-all hover:text-white hover:shadow-md focus:ring-2 focus:outline-none"
            >
              Get Access
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
