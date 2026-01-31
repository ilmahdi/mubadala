import { Settings, Bell, ChartArea } from 'lucide-react';
import { colors } from '@/src/config/design-tokens';

export default function Header() {
  return (
    <header
      className="sticky top-0 border border-gray-100 bg-white shadow-xs"
      style={{ zIndex: 'var(--z-index-sticky)' }}
    >
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded text-white">
            <ChartArea className="text-brand" size={20} strokeWidth={2.4} />
          </div>
          <h1 className="text-lg font-medium text-gray-900">Mubadala</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 transition-colors hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-800" />
            <span
              className="absolute top-2 right-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: colors.brand.primary }}
              aria-label="New notifications"
            />
          </button>

          <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-800" />
          </button>

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
