/**
 * Design System Showcase
 * Visual reference and testing page for all design tokens and component styles
 *
 * To view: Create a route at /design-system in your Next.js app
 */

'use client';

import { colors, spacing, radius, shadows } from '@/src/config/design-tokens';
import {
  cardStyles,
  textStyles,
  badgeStyles,
  flowBadgeStyles,
  containerStyles,
  separatorStyles,
} from '@/src/config/component-styles';
import { Button } from '@/src/components/ui/button';

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <header className="border-b border-gray-200 pb-6">
          <h1 className={textStyles.heading.h1}>Design System</h1>
          <p className={textStyles.body.default}>
            Jadwa Trade Management System - Design Token Reference
          </p>
        </header>

        {/* Colors Section */}
        <section className={containerStyles.flexCol}>
          <h2 className={textStyles.heading.h2}>Colors</h2>

          {/* Brand Colors */}
          <div>
            <h3 className={textStyles.heading.h5}>Brand Colors</h3>
            <div className="mt-3 flex gap-3">
              <div className="space-y-2">
                <div
                  className="h-16 w-32 rounded-md border border-gray-200"
                  style={{ backgroundColor: colors.brand.primary }}
                />
                <p className={textStyles.caption}>Primary</p>
                <code className={textStyles.code}>{colors.brand.primary}</code>
              </div>
              <div className="space-y-2">
                <div
                  className="h-16 w-32 rounded-md border border-gray-200"
                  style={{ backgroundColor: colors.brand.primaryHover }}
                />
                <p className={textStyles.caption}>Hover</p>
                <code className={textStyles.code}>
                  {colors.brand.primaryHover}
                </code>
              </div>
              <div className="space-y-2">
                <div
                  className="h-16 w-32 rounded-md border border-gray-200"
                  style={{ backgroundColor: colors.brand.primaryLight }}
                />
                <p className={textStyles.caption}>Light</p>
                <code className={textStyles.code}>
                  {colors.brand.primaryLight}
                </code>
              </div>
            </div>
          </div>

          {/* Gray Scale */}
          <div className="mt-6">
            <h3 className={textStyles.heading.h5}>Gray Scale</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {Object.entries(colors.gray).map(([shade, value]) => (
                <div key={shade} className="space-y-2">
                  <div
                    className="h-16 w-20 rounded-md border border-gray-300"
                    style={{ backgroundColor: value }}
                  />
                  <p className={textStyles.caption}>gray-{shade}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div>
              <h3 className={textStyles.heading.h6}>Success</h3>
              <div className="mt-2 space-y-2">
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.success[50] }}
                />
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.success[500] }}
                />
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.success[700] }}
                />
              </div>
            </div>
            <div>
              <h3 className={textStyles.heading.h6}>Error</h3>
              <div className="mt-2 space-y-2">
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.error[50] }}
                />
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.error[500] }}
                />
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.error[700] }}
                />
              </div>
            </div>
            <div>
              <h3 className={textStyles.heading.h6}>Warning</h3>
              <div className="mt-2 space-y-2">
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.warning[50] }}
                />
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.warning[500] }}
                />
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.warning[700] }}
                />
              </div>
            </div>
            <div>
              <h3 className={textStyles.heading.h6}>Info</h3>
              <div className="mt-2 space-y-2">
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.info[50] }}
                />
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.info[500] }}
                />
                <div
                  className="h-12 w-full rounded-md"
                  style={{ backgroundColor: colors.info[700] }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className={separatorStyles.horizontal} />

        {/* Typography Section */}
        <section className={containerStyles.flexCol}>
          <h2 className={textStyles.heading.h2}>Typography</h2>

          <div className="space-y-3">
            <div>
              <p className={textStyles.caption}>Heading 1</p>
              <h1 className={textStyles.heading.h1}>The quick brown fox</h1>
            </div>
            <div>
              <p className={textStyles.caption}>Heading 2</p>
              <h2 className={textStyles.heading.h2}>The quick brown fox</h2>
            </div>
            <div>
              <p className={textStyles.caption}>Heading 3</p>
              <h3 className={textStyles.heading.h3}>The quick brown fox</h3>
            </div>
            <div>
              <p className={textStyles.caption}>Heading 4</p>
              <h4 className={textStyles.heading.h4}>The quick brown fox</h4>
            </div>
            <div>
              <p className={textStyles.caption}>Heading 5</p>
              <h5 className={textStyles.heading.h5}>The quick brown fox</h5>
            </div>
            <div>
              <p className={textStyles.caption}>Body Large</p>
              <p className={textStyles.body.large}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <p className={textStyles.caption}>Body Default</p>
              <p className={textStyles.body.default}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <p className={textStyles.caption}>Body Small</p>
              <p className={textStyles.body.small}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <p className={textStyles.caption}>Label</p>
              <p className={textStyles.label}>Form Label Text</p>
            </div>
            <div>
              <p className={textStyles.caption}>Muted</p>
              <p className={textStyles.muted}>Muted secondary text</p>
            </div>
            <div>
              <p className={textStyles.caption}>Code</p>
              <code className={textStyles.code}>
                const value = &quot;monospace code&quot;;
              </code>
            </div>
          </div>
        </section>

        <div className={separatorStyles.horizontal} />

        {/* Badges Section */}
        <section className={containerStyles.flexCol}>
          <h2 className={textStyles.heading.h2}>Badges</h2>

          <div>
            <h3 className={textStyles.heading.h5}>Standard Badges</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`${badgeStyles.default} ${badgeStyles.primary}`}>
                Primary
              </span>
              <span
                className={`${badgeStyles.default} ${badgeStyles.secondary}`}
              >
                Secondary
              </span>
              <span className={`${badgeStyles.default} ${badgeStyles.success}`}>
                Success
              </span>
              <span className={`${badgeStyles.default} ${badgeStyles.error}`}>
                Error
              </span>
              <span className={`${badgeStyles.default} ${badgeStyles.warning}`}>
                Warning
              </span>
              <span className={`${badgeStyles.default} ${badgeStyles.info}`}>
                Info
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className={textStyles.heading.h5}>Flow Type Badges</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`${flowBadgeStyles.base} ${flowBadgeStyles.import}`}
              >
                Import
              </span>
              <span
                className={`${flowBadgeStyles.base} ${flowBadgeStyles.export}`}
              >
                Export
              </span>
              <span
                className={`${flowBadgeStyles.base} ${flowBadgeStyles.tempWithout}`}
              >
                Temp Without
              </span>
              <span
                className={`${flowBadgeStyles.base} ${flowBadgeStyles.tempWith}`}
              >
                Temp With
              </span>
              <span
                className={`${flowBadgeStyles.base} ${flowBadgeStyles.reexportWith}`}
              >
                Reexport With
              </span>
              <span
                className={`${flowBadgeStyles.base} ${flowBadgeStyles.reexportWithout}`}
              >
                Reexport Without
              </span>
              <span
                className={`${flowBadgeStyles.base} ${flowBadgeStyles.default}`}
              >
                Default
              </span>
            </div>
          </div>
        </section>

        <div className={separatorStyles.horizontal} />

        {/* Buttons Section */}
        <section className={containerStyles.flexCol}>
          <h2 className={textStyles.heading.h2}>Buttons</h2>

          <div className="space-y-4">
            <div>
              <h3 className={textStyles.heading.h5}>Variants</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <h3 className={textStyles.heading.h5}>Sizes</h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </div>
        </section>

        <div className={separatorStyles.horizontal} />

        {/* Cards Section */}
        <section className={containerStyles.flexCol}>
          <h2 className={textStyles.heading.h2}>Cards</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className={cardStyles.default}>
              <h3 className={textStyles.heading.h5}>Default Card</h3>
              <p className={textStyles.body.small}>
                Standard card with border and padding
              </p>
            </div>
            <div className={cardStyles.compact}>
              <h3 className={textStyles.heading.h5}>Compact Card</h3>
              <p className={textStyles.body.small}>
                Less padding for dense layouts
              </p>
            </div>
            <div className={cardStyles.elevated}>
              <h3 className={textStyles.heading.h5}>Elevated Card</h3>
              <p className={textStyles.body.small}>
                More prominent with shadow
              </p>
            </div>
            <div className={cardStyles.interactive}>
              <h3 className={textStyles.heading.h5}>Interactive Card</h3>
              <p className={textStyles.body.small}>Hover over me!</p>
            </div>
            <div className={cardStyles.flat}>
              <h3 className={textStyles.heading.h5}>Flat Card</h3>
              <p className={textStyles.body.small}>Subtle gray background</p>
            </div>
          </div>
        </section>

        <div className={separatorStyles.horizontal} />

        {/* Shadows Section */}
        <section className={containerStyles.flexCol}>
          <h2 className={textStyles.heading.h2}>Shadows</h2>

          <div className="grid grid-cols-4 gap-4">
            {Object.entries({
              xs: shadows.xs,
              sm: shadows.sm,
              md: shadows.md,
              lg: shadows.lg,
              xl: shadows.xl,
            }).map(([name, shadow]) => (
              <div key={name}>
                <div
                  className="h-24 rounded-md bg-white"
                  style={{ boxShadow: shadow }}
                />
                <p className={`${textStyles.caption} mt-2`}>shadow-{name}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={separatorStyles.horizontal} />

        {/* Spacing Section */}
        <section className={containerStyles.flexCol}>
          <h2 className={textStyles.heading.h2}>Spacing Scale</h2>

          <div className="space-y-2">
            {[1, 2, 3, 4, 6, 8, 12].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <code className={`${textStyles.code} w-20`}>
                  spacing[{size}]
                </code>
                <div
                  className="bg-brand/20 h-8 rounded"
                  style={{ width: spacing[size as keyof typeof spacing] }}
                />
                <span className={textStyles.caption}>
                  {spacing[size as keyof typeof spacing]}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className={separatorStyles.horizontal} />

        {/* Border Radius Section */}
        <section className={containerStyles.flexCol}>
          <h2 className={textStyles.heading.h2}>Border Radius</h2>

          <div className="flex gap-4">
            {Object.entries({
              sm: radius.sm,
              md: radius.md,
              lg: radius.lg,
              xl: radius.xl,
              '2xl': radius['2xl'],
              full: radius.full,
            }).map(([name, r]) => (
              <div key={name} className="space-y-2">
                <div
                  className="bg-brand h-16 w-16"
                  style={{ borderRadius: r }}
                />
                <p className={textStyles.caption}>radius-{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 pt-6 text-center">
          <p className={textStyles.muted}>
            Design System v1.0.0 • Jadwa Trade Management System
          </p>
        </footer>
      </div>
    </div>
  );
}
