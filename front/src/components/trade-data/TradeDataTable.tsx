'use client';

import { columns } from './columns';
import { ManagedDataTable } from './ManagedDataTable';
import { useTradeData } from '../../hooks/use-trade-data';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { textStyles } from '@/src/config/component-styles';

export default function TradeDataTable() {
  return (
    <div>
      <div className="flex-1 overflow-auto rounded-sm">
        <NuqsAdapter>
          <TradeDataTableContent />
        </NuqsAdapter>
      </div>
    </div>
  );
}

function TradeDataTableContent() {
  const { data, loading, error, totalCount } = useTradeData();

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <ManagedDataTable
      columns={columns}
      data={data}
      loading={loading}
      totalCount={totalCount}
    />
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <p className={textStyles.error}>{message}</p>
    </div>
  );
}
