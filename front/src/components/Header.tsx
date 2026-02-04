import { ChartArea } from 'lucide-react';
import { colors } from '@/src/config/design-tokens';
import Link from 'next/link';

export default function Header() {
  return (
    <header
      className="sticky top-0 border border-gray-100 bg-white shadow-xs"
      style={{ zIndex: 'var(--z-index-sticky)' }}
    >
      <div className="flex h-14 items-center justify-between px-6">
        <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
          <div className="flex items-center">
            <div
              className="flex h-10 w-10 items-center justify-center"
              style={{ color: 'var(--color-brand-primary)' }}
            >
              <ChartArea className="text-brand" size={22} strokeWidth={2.8} />
            </div>
            <h2
              className="text-lg font-semibold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Mubadala
            </h2>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium text-white transition-colors"
            style={{
              backgroundColor: colors.brand.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.brand.primaryLight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.brand.primary;
            }}
          >
            AE
          </button>
        </div>
      </div>
    </header>
  );
}
