/**
 * Landing Footer Component
 * Footer for landing page with links and branding
 */

import { ChartArea } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer
      className="border-t border-gray-200 bg-gray-50 pt-16 pb-10"
      id="about"
    >
      <div className="flex justify-center px-6 lg:px-10">
        <div className="flex w-full max-w-300 flex-col gap-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Brand Column */}
            <div className="flex flex-col gap-4 md:col-span-2">
              <div className="flex items-center">
                <div
                  className="flex h-10 w-10 items-center justify-center"
                  style={{ color: 'var(--color-brand-primary)' }}
                >
                  <ChartArea
                    className="text-brand"
                    size={24}
                    strokeWidth={2.8}
                  />
                </div>
                <h2
                  className="text-xl font-semibold tracking-tight"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Mubadala
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-gray-600">
                The premier platform for Moroccan foreign trade data, providing
                accurate and up-to-date records across the Kingdom.
              </p>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                Resources
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-brand text-sm text-gray-600 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand text-sm text-gray-600 transition-colors"
                  >
                    Data Dictionary
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand text-sm text-gray-600 transition-colors"
                  >
                    Market Reports
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Contact */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                Legal & Contact
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="#"
                    className="hover:text-brand text-sm text-gray-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand text-sm text-gray-600 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-brand text-sm text-gray-600 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 md:flex-row">
            <p className="text-xs text-gray-500">
              © 2026 Mubadala Analytics. Morocco Trade Data.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-brand text-gray-400 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
