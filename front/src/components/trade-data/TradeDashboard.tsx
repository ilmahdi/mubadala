import TradeDataTable from './TradeDataTable';

export default function TradeDashboard() {
  return (
    <div className="flex h-fit flex-col gap-3 overflow-auto">
      {/* Top summary area (placeholder for future KPIs/charts) */}
      {/* <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md border-[0.5px] border-gray-200 bg-white px-4 py-3 text-xs text-gray-500">
          Total Imports
        </div>
        <div className="rounded-md border-[0.5px] border-gray-200 bg-white px-4 py-3 text-xs text-gray-500">
          Total Exports
        </div>
        <div className="rounded-md border-[0.5px] border-gray-200 bg-white px-4 py-3 text-xs text-gray-500">
          Trade Balance
        </div>
      </div> */}

      {/* Main table area */}
      <div className="min-h-0 flex-1">
        <TradeDataTable />
      </div>
    </div>
  );
}
