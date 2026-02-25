import { ChartArea } from 'lucide-react';
import { headerStyles } from '@/src/config/component-styles';
import Link from 'next/link';
import { UserMenu } from '@/src/components/auth/UserMenu';

export default function Header() {
  return (
    <header className={headerStyles.container + ' z-(--z-index-sticky)'}>
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
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
