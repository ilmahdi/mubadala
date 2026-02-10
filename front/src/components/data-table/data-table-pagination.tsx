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
import { paginationStyles } from '@/src/config/component-styles';

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
    <div className={paginationStyles.container}>
      <p className={paginationStyles.text}>
        Showing{' '}
        <span className={paginationStyles.textBold}>
          {totalCount === 0 ? 0 : startRow}
        </span>
        –<span className={paginationStyles.textBold}>{endRow}</span> of{' '}
        <span className={paginationStyles.textBold}>{totalCount}</span> results
      </p>

      <div className={paginationStyles.controls}>
        <div className={paginationStyles.pageInfo}>
          Page{' '}
          <span className={paginationStyles.textBold}>{pageIndex + 1}</span> of{' '}
          <span className={paginationStyles.textBold}>{pageCount}</span>
        </div>

        <div className={paginationStyles.buttonGroup}>
          <button
            className={paginationStyles.button}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          <button
            className={paginationStyles.button}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            className={paginationStyles.button}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            className={paginationStyles.button}
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
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
