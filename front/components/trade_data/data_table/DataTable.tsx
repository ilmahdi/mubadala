'use client';

import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table } from '@/components/ui/table';
import { DataTableHeader } from './DataTableHeader';
import { DataTableBody } from './DataTableBody';
import { Pagination } from './Pagination';
import { DISPLAYED_FIELDS } from './constants';
import { DataTableProps } from './types';

type AnyRecord = Record<string, any>;

export function DataTable<TData extends AnyRecord>({
  columns,
  data,
  loading,
}: DataTableProps<TData>) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    autoResetPageIndex: false,
  });

  const headers = useMemo(
    () =>
      table
        .getHeaderGroups()
        .flatMap((g) => g.headers)
        .filter((h) => DISPLAYED_FIELDS.has(h.id)),
    [table],
  );

  return (
    <div className="overflow-hidden bg-white">
      <Table className="text-sm">
        <DataTableHeader headers={headers} />

        <DataTableBody
          table={table}
          expandedRowId={expandedRowId}
          onToggle={(rowId) =>
            setExpandedRowId((prev) => (prev === rowId ? null : rowId))
          }
          loading={loading}
        />
      </Table>

      <Pagination table={table} />
    </div>
  );
}
