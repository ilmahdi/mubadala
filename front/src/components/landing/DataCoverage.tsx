/**
 * Data Coverage Section Component
 * Showcases comprehensive Moroccan trade data metrics
 */

'use client';

import { FileText, Package, ArrowLeftRight } from 'lucide-react';

export function DataCoverage() {
  const coverageItems = [
    {
      Icon: FileText,
      title: 'Trade Records',
      description:
        'Access detailed shipment records including declarations, values, and quantities for robust analysis.',
    },
    {
      Icon: Package,
      title: 'HS Codes',
      description:
        'Detailed breakdown of all Harmonized System codes relevant to Moroccan import and export regulations.',
    },
    {
      Icon: ArrowLeftRight,
      title: 'Trade Flows',
      description:
        'Real-time monitoring of Import, Export, and Transit flows entering and leaving the Kingdom.',
    },
  ];

  return (
    <section className="w-full bg-white py-24" id="coverage">
      <div className="flex justify-center px-6 lg:px-10">
        <div className="w-full max-w-300">
          {/* Section Header */}
          <div className="mb-12 flex flex-col items-center gap-2 text-center">
            <h3 className="text-brand mb-1 text-xs font-bold tracking-[0.15em] uppercase">
              Data Coverage
            </h3>
            <h2 className="mt-1 text-3xl font-bold text-gray-900">
              Comprehensive Moroccan Metrics
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-gray-600">
              Our database tracks millions of records across all major trade
              classifications, ensuring complete market visibility.
            </p>
          </div>

          {/* Coverage Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {coverageItems.map((item, index) => {
              const Icon = item.Icon;
              return (
                <div
                  key={index}
                  className="hover:border-brand/20 group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  {/* Background Icon */}
                  <div className="absolute top-0 right-0 p-6 opacity-5 transition-opacity group-hover:opacity-10">
                    <Icon className="text-brand" size={96} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                    <div className="text-brand flex h-12 w-12 items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm">
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="mb-2 text-3xl font-bold text-gray-900">
                        {item.title}
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    </div>
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
