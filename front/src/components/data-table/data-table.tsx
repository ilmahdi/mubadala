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
import { cn } from '@/src/lib/utils';
import { Skeleton } from './data-table-cell-skeleton';
import { tableStyles } from '@/src/config/component-styles';

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
      className={cn('flex w-full flex-col gap-2 overflow-auto', className)}
      {...props}
    >
      {children}

      <div className={tableStyles.wrapper}>
        <Table className="text-sm">
          <TableHeader className={tableStyles.header}>
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
                    className={tableStyles.header}
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

      <div className="flex flex-col">
        <DataTablePagination
          table={table}
          totalCount={totalCount}
          loading={loading}
        />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
