'use client';

import { useQueryStates, parseAsString, parseAsArrayOf } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { filterStyles } from '@/src/config/component-styles';
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
    <div className={filterStyles.container}>
      <div className={filterStyles.header}>
        <h2 className={filterStyles.title}>FILTERS</h2>
        <button onClick={handleResetAll} className={filterStyles.resetButton}>
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
