/**
 * Features Section Component
 * Showcase key platform features with icons and descriptions
 */

'use client';

import {
  Filter,
  Search,
  TrendingUp,
  Globe,
  Calendar,
  Shield,
  Zap,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: Filter,
    title: 'Advanced Filtering',
    description:
      'Filter by continent, country, date range, flow type, and more. Build complex queries with ease.',
  },
  {
    icon: Search,
    title: 'Real-time Search',
    description:
      'Instant search across all trade data with smart autocomplete and relevance ranking.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description:
      'Visualize trends, compare regions, and discover insights with interactive charts.',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description:
      'Access trade data from over 200 countries across all continents.',
  },
  {
    icon: Calendar,
    title: 'Historical Data',
    description:
      'Analyze trade patterns over time with comprehensive historical records.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description:
      'Enterprise-grade security with Google OAuth authentication and encrypted data.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Optimized queries and caching ensure instant results even with millions of records.',
  },
  {
    icon: BarChart3,
    title: 'Export & Share',
    description:
      'Export filtered data to CSV or share custom views with shareable URLs.',
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="mb-4 text-sm font-semibold tracking-wider uppercase"
            style={{ color: 'var(--color-brand-primary)' }}
          >
            Powerful Features
          </h2>
          <p className="mb-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Everything you need to analyze global trade
          </p>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Our platform provides professional-grade tools for trade analysis,
            from filtering and search to advanced analytics and exports.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-20 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
                >
                  <div className="relative">
                    <div
                      className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: 'var(--color-brand-primary-alpha-10)',
                      }}
                    >
                      <Icon
                        className="h-7 w-7"
                        style={{ color: 'var(--color-brand-primary)' }}
                      />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-base leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
