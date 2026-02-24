/**
 * Data Coverage Section Component
 * Showcases comprehensive Moroccan trade data metrics
 */

import { motion } from 'framer-motion';
import { FileText, Package, ArrowLeftRight } from 'lucide-react';

export function DataCoverage() {
  const coverageItems = [
    {
      Icon: FileText,
      title: '16M+ Trade Records',
      description:
        'Detailed import and export records from official sources, covering all Moroccan trade activities since 1998.',
    },
    {
      Icon: Package,
      title: 'HS Classification System',
      description:
        'Full Harmonized System coverage with chapter, heading, and product-level detail, allowing precise analysis.',
    },
    {
      Icon: ArrowLeftRight,
      title: 'Trade Flows & Partners',
      description:
        'Analyze imports, exports, and transit activity across partner countries and time periods with advanced filtering and sorting.',
    },
  ];

  return (
    <section className="w-full bg-white py-24" id="coverage">
      <div className="flex justify-center px-6 lg:px-10">
        <div className="w-full max-w-300">
          {/* Section Header */}
          <motion.div
            className="mb-16 flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-brand text-xs font-bold tracking-[0.15em] uppercase">
              Data Coverage
            </h3>
            <h2 className="text-3xl font-bold text-gray-900">
              Morocco&apos;s Foreign Trade Coverage
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Structured Access to Morocco&apos;s Official Trade Records
            </p>
          </motion.div>

          {/* Coverage Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {coverageItems.map((item, index) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={index}
                  className="hover:border-brand/30 group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-8 transition-all duration-300 hover:shadow-md"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.1,
                  }}
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
                      <h3 className="mb-2 text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
