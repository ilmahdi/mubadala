import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import type * as React from 'react';

import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DataTableBody } from './data-table-body'; // <-- your new component
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { getColumnPinningStyle } from '@/lib/data-table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  expandedRowId?: string | null;
  onToggleRow?: (id: string | null) => void;
  loading?: boolean;
}

export function DataTable<TData extends { id: string }>({
  table,
  actionBar,
  expandedRowId = null,
  onToggleRow,
  loading = false,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}
      {...props}
    >
      {children}

      <div className="rounded-0 overflow-hidden border-0">
        <Table className="text-sm">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="w-8" />
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
                    className="font-regular px-2 py-2 text-xs tracking-wide text-gray-600 uppercase"
                  >
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <DataTableBody
            table={table}
            expandedRowId={expandedRowId ?? null}
            onToggle={onToggleRow ?? (() => {})}
            loading={loading}
          />
        </Table>
      </div>

      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
