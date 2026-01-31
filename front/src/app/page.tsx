'use client';

import Header from '@/src/components/Header';
import Search from '@/src/components/Search';
import TradeDashboard from '@/src/components/trade-data/TradeDashboard';

export default function Home() {
  return (
    <div className="flex h-fit flex-col">
      <Header />
      <div className="flex min-h-fit gap-4 p-4 pr-6 pl-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Search />
          <TradeDashboard />
        </div>
      </div>
    </div>
  );
}
