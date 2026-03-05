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

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalCount: number;
  onToggle: (id: string | null) => void;
  loading?: boolean;
  pageSizeOptions?: number[];
}

const LIMIT_OFSET_PAGINATION = 5000;

export function DataTablePagination<TData>({
  table,
  totalCount,
  onToggle,
  loading = false,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
  const isDisabled = (arr: boolean[]) => {
    if (loading) return true;
    return arr.some((condition) => condition);
  };
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
            onClick={() => {
              onToggle(null);
              table.setPageIndex(0);
            }}
            disabled={isDisabled([!table.getCanPreviousPage()])}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>

          <button
            className={paginationStyles.button}
            onClick={() => {
              onToggle(null);
              table.previousPage();
            }}
            disabled={isDisabled([!table.getCanPreviousPage()])}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className={paginationStyles.button}
            onClick={() => {
              onToggle(null);
              table.nextPage();
            }}
            disabled={isDisabled([!table.getCanNextPage()])}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            className={paginationStyles.button}
            onClick={() => {
              onToggle(null);
              table.setPageIndex(pageCount - 1);
            }}
            disabled={isDisabled([
              !table.getCanNextPage(),
              pageCount > LIMIT_OFSET_PAGINATION,
            ])}
            aria-label="Last page"
            title={
              pageCount > LIMIT_OFSET_PAGINATION
                ? 'Page count exceeds 5000, use filters to reduce results'
                : undefined
            }
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
          <SelectTrigger className="bg-background h-6 w-fit rounded-sm border-gray-300 py-0 text-sm outline-0 hover:border-gray-400 data-size:h-6 shadow-none">
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
