'use client';

import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

type SearchMode = 'hscode' | 'product' | 'category';

const modes: { key: SearchMode; label: string }[] = [
  { key: 'hscode', label: 'HS Code' },
  { key: 'product', label: 'Product' },
  { key: 'category', label: 'Category' },
];

const placeholders: Record<SearchMode, string> = {
  hscode: 'Search by HS Code...',
  product: 'Search by product name...',
  category: 'Search by category...',
};

export default function Search() {
  const [mode, setMode] = useState<SearchMode>('hscode');

  const btnClass = (active: boolean) =>
    `rounded-md px-3 py-1 text-xs font-medium transition-colors ${
      active
        ? 'bg-brand text-white shadow-sm'
        : 'text-gray-600 hover:bg-brand/5'
    }`;

  return (
    <div className="flex items-center rounded-md border border-gray-100 bg-white px-2 py-1">
      <div className="flex items-center gap-1 rounded-md bg-gray-50 p-1">
        {modes.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={btnClass(mode === key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mx-4 flex-1">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={placeholders[mode]}
            className="w-full rounded-lg border-0 py-2.5 pr-20 pl-10 text-sm focus:outline-none"
          />
        </div>
      </div>

      <button className="bg-brand hover:bg-brand/80 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white focus:ring-1 focus:ring-gray-200 focus:outline-none">
        Search
      </button>
    </div>
  );
}
