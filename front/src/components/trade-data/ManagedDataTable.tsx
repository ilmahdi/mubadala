'use client';

import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useQueryState, parseAsInteger } from 'nuqs';

import { DataTable } from '@/src/components/data-table/data-table';
import { DataTableSortList } from '@/src/components/data-table/data-table-sort-list';
import { DataTableAdvancedToolbar } from '@/src/components/data-table/data-table-advanced-toolbar';

import { useDataTable } from '@/src/hooks/use-data-table';
import type { TradeRow } from './columns';

const DISPLAYED_FIELDS = new Set([
  'hs_product_code',
  'date',
  'hs_product_label',
  'country_name',
  'flow_label',
  'value_dhs',
]);

type DataTableProps = {
  columns: ColumnDef<TradeRow, unknown>[];
  data: TradeRow[];
  totalCount: number;
  loading?: boolean;
};

export function ManagedDataTable({
  columns,
  data,
  totalCount,
  loading = false,
}: DataTableProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Number of items per page
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = useMemo(() => {
    return Math.ceil(totalCount / perPage);
  }, [totalCount, perPage]);

  // Default column visibility
  const defaultVisibility = useMemo(() => {
    const vis: Record<string, boolean> = {};
    columns.forEach((col) => {
      const id = col.id;
      if (id) vis[id] = DISPLAYED_FIELDS.has(id);
    });
    return vis;
  }, [columns]);

  // Use the table hook
  const { table } = useDataTable<TradeRow>({
    data,
    columns,
    pageCount,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: perPage,
      },
      columnVisibility: defaultVisibility,
    },
    enableAdvancedFilter: true,
    debounceMs: 350,
    shallow: true,
    history: 'replace',
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <DataTable
      table={table}
      totalCount={totalCount}
      expandedRowId={expandedRowId}
      onToggleRow={(id) =>
        setExpandedRowId((prev) => (prev === id ? null : id))
      }
      loading={loading}
    >
      <DataTableAdvancedToolbar table={table}>
        <DataTableSortList table={table} />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
