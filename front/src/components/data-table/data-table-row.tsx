import { Fragment } from 'react';
import { flexRender, Row, Cell } from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { TableCell, TableRow } from '@/src/components/ui/table';
import { DataTableRowExpanded } from './data-table-row-expanded';
import { Skeleton } from './data-table-cell-skeleton';

const iconClass =
  'rounded-sm border border-brand hover:border-brand/60 hover:text-brand/60';

interface DataTableRowProps<TData extends { id: string }> {
  row: Row<TData>;
  isOpen: boolean;
  onToggle: () => void;
  loading?: boolean;
}

export function DataTableRow<TData extends { id: string }>({
  row,
  isOpen,
  onToggle,
  loading = false,
}: DataTableRowProps<TData>) {
  const cells: Cell<TData, unknown>[] = row.getVisibleCells();

  return (
    <Fragment>
      {/* Summary row */}
      <TableRow
        className={`hover:bg-gray-50 ${
          isOpen ? 'border-transparent bg-gray-50/40' : 'border-b'
        }`}
      >
        {/* Expand icon */}
        <TableCell className="w-8 px-1">
          <button
            onClick={onToggle}
            className="text-brand flex cursor-pointer items-center justify-center p-1"
            aria-label={isOpen ? 'Collapse row' : 'Expand row'}
          >
            {loading ? (
              <Skeleton className="h-4.5 w-4.5" />
            ) : isOpen ? (
              <ChevronUp size={18} className={iconClass} />
            ) : (
              <ChevronDown size={18} className={iconClass} />
            )}
          </button>
        </TableCell>

        {cells.map((cell) => (
          <TableCell key={cell.id} className="relative h-12 px-2 py-2">
            <span className="relative inline-block">
              <span
                className={
                  loading ? 'invisible line-clamp-0' : 'flex items-center'
                }
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>

              {loading && (
                <span className="absolute inset-0 flex items-center">
                  <Skeleton className="h-3 w-full" />
                </span>
              )}
            </span>
          </TableCell>
        ))}
      </TableRow>

      {/* Expanded row (disabled while loading) */}
      {!loading && isOpen && (
        <TableRow className="border-b bg-gray-50/40 hover:bg-transparent">
          {/* keep the w-0, it fixes a UI issue */}
          <TableCell
            colSpan={cells.length + 1}
            className="animate-in fade-in slide-in-from-top-2 w-0 px-4 pt-2 pb-4 duration-200"
          >
            <DataTableRowExpanded row={row.original} />
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}
