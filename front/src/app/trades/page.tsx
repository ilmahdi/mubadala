/**
 * Trades Page
 * Main application page for viewing trade data and analytics
 */

import Header from '@/src/components/Header';
import Search from '@/src/components/search/Search';
import TradeDashboard from '@/src/components/trade-data/TradeDashboard';
import { AuthGuard } from '@/src/components/auth/AuthGuard';

export default function TradesPage() {
  return (
    <AuthGuard>
      <div className="flex h-fit flex-col">
        <Header />
        <div className="flex min-h-fit p-4 pr-6 pl-6">
          <div className="mx-auto flex w-full max-w-screen-2xl min-w-0 flex-col gap-2">
            <Search />
            <TradeDashboard />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
