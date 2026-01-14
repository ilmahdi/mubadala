// components/PaginationControls.tsx
'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type { Table } from '@tanstack/react-table';

type PaginationControlsProps<TData> = {
  table: Table<TData>;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function Pagination<TData>({ table }: PaginationControlsProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getCoreRowModel().rows.length;

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const pageCount = table.getPageCount();

  return (
    <div className="flex flex-col gap-4 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-xs font-medium text-gray-600">
        Showing{' '}
        <span className="font-semibold text-gray-900">
          {totalRows === 0 ? 0 : startRow}
        </span>
        –<span className="font-semibold text-gray-900">{endRow}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalRows}</span> results
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 outline-0 hover:border-gray-400 disabled:opacity-40"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          <button
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 outline-0 hover:border-gray-400 disabled:opacity-40"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 outline-0 hover:border-gray-400 disabled:opacity-40"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 outline-0 hover:border-gray-400 disabled:opacity-40"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>

        <div className="text-xs font-medium whitespace-nowrap text-gray-600">
          Page{' '}
          <span className="font-semibold text-gray-900">{pageIndex + 1}</span>{' '}
          of <span className="font-semibold text-gray-900">{pageCount}</span>
        </div>

        <select
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="bg-background h-7 rounded border border-gray-300 px-2 text-sm outline-0 hover:border-gray-400"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} rows
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
