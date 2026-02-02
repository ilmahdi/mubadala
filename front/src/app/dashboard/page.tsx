/**
 * Dashboard Page
 * Main application dashboard with trade data and analytics
 */

'use client';

import Header from '@/src/components/Header';
import Search from '@/src/components/Search';
import TradeDashboard from '@/src/components/trade-data/TradeDashboard';
import { AuthGuard } from '@/src/components/auth/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex h-fit flex-col">
        <Header />
        <div className="flex min-h-fit p-4 pr-6 pl-6">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Search />
            <TradeDashboard />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
