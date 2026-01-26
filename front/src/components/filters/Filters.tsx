import FluxFilter from './FluxFilter';
import CountryFilter from './region-filters/CountryFilter';
import DateFilter from './DateFilter';
import ContinentFilter from './region-filters/ContinentFilter';

export default function Filters() {
  return (
    <div className="flex max-h-fit w-64 min-w-min flex-col gap-1 space-y-4 rounded-md border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-md font-medium text-gray-600">FILTERS</h2>
        <button className="text-brand cursor-pointer text-xs hover:underline">
          Reset All
        </button>
      </div>

      <FluxFilter />
      <ContinentFilter />
      <CountryFilter />
      <DateFilter />
      <div className="flex-1"></div>

      <button className="bg-brand hover:bg-brand/80 mt-2 w-full cursor-pointer rounded-md py-2 text-sm font-medium text-white transition-colors">
        Apply Filters
      </button>
    </div>
  );
}
