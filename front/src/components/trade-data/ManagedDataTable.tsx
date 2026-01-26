'use client';

import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

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

  const defaultVisibility = useMemo(() => {
    const vis: Record<string, boolean> = {};
    columns.forEach((col) => {
      const id = col.id;
      if (id) {
        vis[id] = DISPLAYED_FIELDS.has(id);
      }
    });
    return vis;
  }, [columns]);

  const { table } = useDataTable<TradeRow>({
    columns,
    data,
    pageCount: Math.ceil(totalCount / 10),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      columnVisibility: defaultVisibility,
    },
    enableAdvancedFilter: true,
    debounceMs: 350,
    shallow: true, // better UX in Next.js
    history: 'replace', // don't create new history entries
    clearOnDefault: true,
    manualPagination: true, // Enable server-side pagination
    manualSorting: true, // Enable server-side sorting
    manualFiltering: true, // Enable server-side filtering
  });

  return (
    <DataTable
      table={table}
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
