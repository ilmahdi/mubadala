import { ChartArea } from 'lucide-react';
import {
  headerStyles,
  avatarStyles,
  combineStyles,
} from '@/src/config/component-styles';
import Link from 'next/link';

export default function Header() {
  return (
    <header
      className={headerStyles.container}
      style={{ zIndex: 'var(--z-index-sticky)' }}
    >
      <div className={headerStyles.inner}>
        <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
          <div className={headerStyles.logo}>
            <div className={headerStyles.logoIcon}>
              <ChartArea className="text-brand" size={22} strokeWidth={2.8} />
            </div>
            <h2 className={headerStyles.logoText}>Mubadala</h2>
          </div>
        </Link>

        <div className={headerStyles.actions}>
          <button
            className={combineStyles(
              avatarStyles.base,
              avatarStyles.md,
              avatarStyles.brand,
              avatarStyles.interactive,
            )}
            aria-label="User account"
          >
            AE
          </button>
        </div>
      </div>
    </header>
  );
}
