import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import type * as React from 'react';

import { DataTablePagination } from '@/src/components/data-table/data-table-pagination';
import { DataTableBody } from './data-table-body';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { getColumnPinningStyle } from '@/src/lib/data-table';
import { cn } from '@/src/lib/utils';
import { Skeleton } from './data-table-cell-skeleton';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  totalCount: number;
  actionBar?: React.ReactNode;
  expandedRowId?: string | null;
  onToggleRow?: (id: string | null) => void;
  loading?: boolean;
}

export function DataTable<TData extends { id: string }>({
  table,
  totalCount,
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
                {/* Expand icon header */}
                <TableHead className="w-8 px-1">
                  {loading ? <Skeleton className="h-4 w-4" /> : null}
                </TableHead>

                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
                    className="font-regular px-2 py-2 text-xs tracking-wide text-gray-600 uppercase"
                  >
                    {loading ? (
                      <Skeleton className="h-4 w-full" />
                    ) : (
                      !header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
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
        <DataTablePagination table={table} totalCount={totalCount} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
