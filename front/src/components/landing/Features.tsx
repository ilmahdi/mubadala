/**
 * Features Section Component
 * Showcase key platform features with icons and descriptions
 */

import { motion } from 'framer-motion';
import {
  Search,
  Download,
  SlidersHorizontal,
  ArrowUpDown,
  Table,
  Layers2,
} from 'lucide-react';

const features = [
  {
    Icon: SlidersHorizontal,
    title: 'Multi-Field Filtering',
    description:
      'Filter records by HS code, product label, country, trade flow, date range and more.',
    comingSoon: false,
  },
  {
    Icon: Search,
    title: 'HS Code & Label Search',
    description:
      'Search directly by exact HS code or product description across the full dataset.',
    comingSoon: false,
  },
  {
    Icon: ArrowUpDown,
    title: 'Row Sorting',
    description:
      'Sort results by year, trade value, quantity, partner country, or product code.',
    comingSoon: false,
  },
  {
    Icon: Table,
    title: 'Customizable Table View',
    description:
      'Structured tabular display with selectable columns and clear key trade fields.',
    comingSoon: false,
  },
  {
    Icon: Layers2,
    title: 'Optimized Pagination',
    description:
      'Navigate efficiently through millions of records with server-side pagination.',
    comingSoon: false,
  },
  {
    Icon: Download,
    title: 'CSV & Excel Export',
    description:
      'Export filtered datasets in structured CSV or Excel format for further analysis.',
    comingSoon: true,
  },
];

export function Features() {
  return (
    <section
      className="border-t border-gray-100 bg-gray-50 px-6 py-24 lg:px-10"
      id="features"
    >
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-300 flex-col gap-16">
          {/* Section Header */}
          <motion.div
            className="flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-brand text-xs font-bold tracking-[0.15em] uppercase">
              Features
            </h3>
            <h2 className="text-3xl font-bold text-gray-900">
              Platform Capabilities
            </h2>
            <p className="max-w-xl text-base text-gray-600">
              Powerful tools for exploring Moroccan trade data at scale.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.Icon;
              return (
                <motion.div
                  key={index}
                  className={`group rounded-xl border bg-white p-6 transition-all duration-300 ${
                    feature.comingSoon
                      ? 'border-gray-200 opacity-90'
                      : 'hover:border-brand/30 border-gray-200 hover:shadow-lg'
                  }`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.07,
                  }}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm transition-colors ${
                        feature.comingSoon
                          ? 'text-gray-500'
                          : 'group-hover:bg-brand text-gray-600 group-hover:text-white'
                      }`}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    {feature.comingSoon && (
                      <span className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-gray-500 uppercase">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h3
                    className={`mb-2 text-lg font-bold ${
                      feature.comingSoon ? 'text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {feature.description.split('HS Code').map((part, i, arr) =>
                      i < arr.length - 1 ? (
                        <span key={i}>
                          {part}
                          <span className="text-brand/80 font-mono text-xs">
                            HS Code
                          </span>
                        </span>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
