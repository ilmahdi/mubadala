'use client';

import { useMemo } from 'react';
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list';
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar';
import { DataTableFilterList } from '@/components/data-table/data-table-filter-list';

import { useDataTable } from '@/hooks/use-data-table'; // ← your new hook
import type { DataTableProps } from './types';
import { DISPLAYED_FIELDS } from './constants';

type AnyRecord = Record<string, any>;

export function DataTableCore<TData extends AnyRecord>({
  columns,
  data,
  loading,
}: DataTableProps<TData>) {
  const defaultVisibility = useMemo(() => {
    const vis: Record<string, boolean> = {};
    columns.forEach((col) => {
      const id = col.id || (col as any).accessorKey;
      if (id) {
        vis[id] = DISPLAYED_FIELDS.has(id);
      }
    });
    return vis;
  }, [columns]);

  const { table } = useDataTable<TData>({
    columns,
    data: data,
    pageCount: data.length / 10,

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
    <DataTable table={table}>
      <DataTableAdvancedToolbar table={table}>
        <DataTableFilterList table={table} />
        <DataTableSortList table={table} />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
