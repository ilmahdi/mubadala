'use client';

import { columns } from './columns';
import { ManagedDataTable } from './ManagedDataTable';
import { useTradeData } from './useTradeData';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function TradeDataTable() {
  const { data, loading, error } = useTradeData();

  return (
    <div className="flex h-full flex-col rounded-md bg-white">
      <div className="flex-1 overflow-auto rounded-sm border-0 border-gray-100">
        {error ? (
          <ErrorState message={error} />
        ) : (
          <NuqsAdapter>
            <ManagedDataTable columns={columns} data={data} loading={loading} />
          </NuqsAdapter>
        )}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-xs text-red-500">
      {message}
    </div>
  );
}
