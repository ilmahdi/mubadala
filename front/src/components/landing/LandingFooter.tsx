/**
 * Landing Footer Component
 * Footer for landing page with links and branding
 */

'use client';

import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { textStyles } from '@/src/config/component-styles';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/use-auth';

const navigationBase = {
  productBase: [
    { name: 'Features', href: '#features' },
    { name: 'API', href: '/api' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Support', href: '/support' },
    { name: 'Status', href: '/status' },
  ],
  social: [
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: '#',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: '#',
      icon: Mail,
    },
  ],
};

export function LandingFooter() {
  const { isAuthenticated } = useAuth();

  const navigation = {
    product: [
      ...navigationBase.productBase,
      ...(isAuthenticated ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
    ],
    company: navigationBase.company,
    resources: navigationBase.resources,
    social: navigationBase.social,
  };
  return (
    <footer className="bg-gray-50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Column */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white"
                style={{ backgroundColor: 'var(--color-brand-primary)' }}
              >
                M
              </div>
              <span className={textStyles.heading.h5}>Mubadala Trade</span>
            </div>
            <p className={`${textStyles.body.default} max-w-xs text-gray-600`}>
              Professional trade analytics platform for global insights.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 transition-all hover:scale-110 hover:text-gray-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className={`${textStyles.heading.h6} mb-4`}>Product</h3>
                <ul role="list" className="space-y-3">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`${textStyles.body.small} text-gray-600 transition-colors hover:text-gray-900`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className={`${textStyles.heading.h6} mb-4`}>Company</h3>
                <ul role="list" className="space-y-3">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`${textStyles.body.small} text-gray-600 transition-colors hover:text-gray-900`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className={`${textStyles.heading.h6} mb-4`}>Resources</h3>
                <ul role="list" className="space-y-3">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`${textStyles.body.small} text-gray-600 transition-colors hover:text-gray-900`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-gray-200 pt-8 sm:mt-20 lg:mt-24">
          <p className={`${textStyles.body.small} text-center text-gray-500`}>
            &copy; {new Date().getFullYear()} Mubadala Trade Management System.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
