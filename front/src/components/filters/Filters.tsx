'use client';

import { useQueryStates, parseAsString, parseAsArrayOf } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import FluxFilter from './FluxFilter';
import CountryFilter from './region-filters/CountryFilter';
import DateFilter from './DateFilter';
import ContinentFilter from './region-filters/ContinentFilter';

function FiltersContent() {
  const [, setFilters] = useQueryStates({
    flow_label: parseAsString,
    continent: parseAsArrayOf(parseAsString, ','),
    country_name: parseAsArrayOf(parseAsString, ','),
    date_after: parseAsString,
    date_before: parseAsString,
  });

  const handleResetAll = () => {
    setFilters({
      flow_label: null,
      continent: null,
      country_name: null,
      date_after: null,
      date_before: null,
    });
  };

  return (
    <div className="flex max-h-fit w-64 min-w-min flex-col gap-1 space-y-4 rounded-md border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-medium text-gray-600">FILTERS</h2>
        <button
          onClick={handleResetAll}
          className="text-brand cursor-pointer text-xs hover:underline"
        >
          Reset All
        </button>
      </div>

      <FluxFilter />
      <ContinentFilter />
      <CountryFilter />
      <DateFilter />
    </div>
  );
}

export default function Filters() {
  return (
    <NuqsAdapter>
      <FiltersContent />
    </NuqsAdapter>
  );
}
