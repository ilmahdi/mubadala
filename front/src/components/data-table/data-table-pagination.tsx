import type { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>;
  totalCount: number;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  totalCount,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;

  const startRow = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalCount);

  const pageCount = table.getPageCount();
  return (
    <div className="flex flex-col gap-4 px-1 py-1 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-xs font-medium text-gray-600">
        Showing{' '}
        <span className="font-semibold text-gray-900">
          {totalCount === 0 ? 0 : startRow}
        </span>
        –<span className="font-semibold text-gray-900">{endRow}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalCount}</span>{' '}
        results
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

        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="bg-background h-6 w-18 border-gray-300 py-0 text-sm outline-0 hover:border-gray-400 data-size:h-6">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="top"
            className="border-gray-300 bg-white/80 shadow-sm backdrop-blur-sm"
          >
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
