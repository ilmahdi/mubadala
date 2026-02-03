/**
 * Features Section Component
 * Showcase key platform features with icons and descriptions
 */

'use client';

import {
  Filter,
  Search,
  PieChart,
  Download,
  FileText,
  Headphones,
} from 'lucide-react';

const features = [
  {
    Icon: Filter,
    title: 'Precise Filtering',
    description:
      'Filter data by commodity, Origin/Destination country, or specific HS Code chapters.',
  },
  {
    Icon: Search,
    title: 'Record Search',
    description:
      'Instantly locate specific transactions or customs declarations within the Moroccan database.',
  },
  {
    Icon: PieChart,
    title: 'Visual Analytics',
    description:
      'Interactive charts visualizing market share, volume trends, and value distribution across commodities.',
  },
  {
    Icon: Download,
    title: 'Data Export',
    description:
      'Download clean, structured datasets in CSV or Excel for your own internal modeling.',
  },
  {
    Icon: FileText,
    title: 'Custom Reports',
    description:
      'Generate PDF executive summaries on specific sectors (e.g., Phosphate exports, Citrus imports).',
  },
  {
    Icon: Headphones,
    title: 'Expert Support',
    description:
      'Dedicated assistance to help you interpret complex Moroccan customs data fields.',
  },
];

export function Features() {
  return (
    <section
      className="border-t border-gray-100 bg-gray-50 px-6 py-24 lg:px-10"
      id="features"
    >
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-300 flex-col gap-12">
          {/* Section Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-brand mb-1 text-xs font-bold tracking-[0.15em] uppercase">
              Features
            </h3>
            <h2 className="mt-1 text-3xl font-bold text-gray-900">
              Platform Capabilities
            </h2>
            <p className="mt-3 max-w-xl text-lg text-gray-600">
              Advanced tools designed for trade analysts, logistics managers,
              and investors focused on the Moroccan market.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.Icon;
              return (
                <div
                  key={index}
                  className="group hover:border-brand/30 rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="group-hover:bg-brand mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-600 shadow-sm transition-colors group-hover:text-white">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
