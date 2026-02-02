/**
 * Landing Header Component
 * Simplified header for landing page with navigation and auth
 */

'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SignInButton } from '@/src/components/auth/SignInButton';
import { UserMenu } from '@/src/components/auth/UserMenu';
import { useAuth } from '@/src/hooks/use-auth';
import { textStyles } from '@/src/config/component-styles';
import Link from 'next/link';

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const navigation = [
    { name: 'Features', href: '#features' },
    ...(isAuthenticated ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
            >
              M
            </div>
            <span className={`${textStyles.heading.h5} hidden sm:block`}>
              Mubadala Trade
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="focus:ring-brand -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 focus:ring-2 focus:outline-none focus:ring-inset"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${textStyles.body.default} hover:text-brand-primary font-semibold text-gray-900 transition-colors`}
              onClick={(e) => {
                if (item.href.startsWith('#')) {
                  e.preventDefault();
                  document
                    .getElementById(item.href.slice(1))
                    ?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isLoading ? (
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white"
                  style={{ backgroundColor: 'var(--color-brand-primary)' }}
                >
                  M
                </div>
                <span className={textStyles.heading.h5}>Mubadala Trade</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${textStyles.body.default} -mx-3 block rounded-lg px-3 py-2 font-semibold text-gray-900 transition-colors hover:bg-gray-50`}
                      onClick={(e) => {
                        if (item.href.startsWith('#')) {
                          e.preventDefault();
                          document
                            .getElementById(item.href.slice(1))
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  {isLoading ? (
                    <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                  ) : isAuthenticated ? (
                    <UserMenu />
                  ) : (
                    <SignInButton className="w-full justify-center" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
