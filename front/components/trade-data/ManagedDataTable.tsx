'use client';

import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar';

import { useDataTable } from '@/hooks/use-data-table';

const DISPLAYED_FIELDS = new Set([
  'hs_product_code',
  'date',
  'hs_product_label',
  'country_name',
  'flow_label',
  'value_dhs',
]);

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  loading?: boolean;
};

export function ManagedDataTable<TData extends { id: string }>({
  columns,
  data,
  loading = false,
}: DataTableProps<TData>) {
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

  const { table } = useDataTable<TData>({
    columns,
    data,
    pageCount: Math.ceil(data.length / 10),
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
