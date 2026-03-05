'use client';

import { columns } from './columns';
import { ManagedDataTable } from './ManagedDataTable';
import { useTradeData } from '../../hooks/use-trade-data';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { textStyles } from '@/src/config/component-styles';
import { AlertCircle } from 'lucide-react';

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
    <div className="flex h-64 items-center justify-center">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <div className="border-error-100 bg-error-50 flex h-12 w-12 items-center justify-center rounded-xl border">
          <AlertCircle className="text-error-600 h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className={textStyles.heading.h6}>Something went wrong</p>
          <p className={textStyles.body.small}>{message}</p>
        </div>
      </div>
    </div>
  );
}
