'use client';

import React, { Fragment, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DISPLAYED_FIELDS = new Set([
  'hs_product_code',
  'date',
  'hs_product_label',
  'country_name',
  'flow_label',
  'value_dhs',
]);

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
};

type AnyRecord = Record<string, any>;

export function DataTable<TData extends AnyRecord>({
  columns,
  data,
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
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-8" />
            {headers.map((header) => (
              <TableHead
                key={header.id}
                className="font-regular px-2 py-2 text-xs tracking-wide text-gray-600 uppercase"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <ExpandableRow
                  key={row.id}
                  row={row}
                  isOpen={expandedRowId === row.id}
                  onToggle={() =>
                    setExpandedRowId(expandedRowId === row.id ? null : row.id)
                  }
                />
              ))
          ) : (
            <EmptyState colSpan={DISPLAYED_FIELDS.size + 1} />
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}
            </span>{' '}
            of{' '}
            <span className="font-medium">
              {table.getFilteredRowModel().rows.length}
            </span>{' '}
            results
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="rounded border border-gray-300 p-1 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="First page"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded border border-gray-300 p-1 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded border border-gray-300 p-1 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="rounded border border-gray-300 p-1 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Last page"
            >
              <ChevronsRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Page</span>
            <strong className="text-sm text-gray-900">
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </div>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
          >
            {[10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function ExpandableRow({
  row,
  isOpen,
  onToggle,
}: {
  row: any;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const cells = row
    .getVisibleCells()
    .filter((cell: any) => DISPLAYED_FIELDS.has(cell.column.id));

  return (
    <Fragment>
      <TableRow
        className={`hover:bg-gray-50 ${
          isOpen ? 'border-transparent bg-gray-50/40' : 'border-b'
        }`}
      >
        <TableCell onClick={onToggle} className="text-brand w-8 cursor-pointer">
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </TableCell>

        {cells.map((cell: any) => (
          <TableCell
            key={cell.id}
            className="font-regular h-12 px-2 py-2 text-gray-700"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>

      {isOpen && (
        <TableRow className="border-b bg-gray-50/40">
          <TableCell colSpan={cells.length + 1} className="w-0 px-4 pt-2 pb-4">
            <DetailsGrid row={row.original} />
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}

const iconClass =
  'rounded-sm border border-brand hover:border-brand/60 hover:text-brand/60';

const ChevronUpIcon = () => <ChevronUp size={18} className={iconClass} />;
const ChevronDownIcon = () => <ChevronDown size={18} className={iconClass} />;

const DETAILS_CONFIG = [
  { label: 'HS Chapter', key: 'hs_chapter' },
  { label: 'HS Product', key: 'hs_product' },
  { label: 'CTCI Section', key: 'ctci_section' },
  { label: 'CTCI Division', key: 'ctci_division' },
  { label: 'CTCI Group', key: 'ctci_group' },
  { label: 'Usage Group', key: 'usage_group' },
  { label: 'Remarkable Product', key: 'remarkable_product' },
  { label: 'Flow', key: 'flow' },
];

function DetailsGrid({ row }: { row: AnyRecord }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
      {DETAILS_CONFIG.map(({ label, key }) => (
        <Detail
          key={key}
          label={label}
          value={`${row[`${key}_code`]} – ${row[`${key}_label`]}`}
        />
      ))}

      <Detail label="Continent" value={row.continent} />
      <Detail
        label="Complementary Unit"
        value={row.complementary_unit || '—'}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col border-l-2 border-gray-100 bg-gray-50 p-2">
      <span className="text-xs font-medium text-gray-400">{label}</span>
      <span className="text-xs font-medium text-gray-600 lowercase">
        {value}
      </span>
    </div>
  );
}

function EmptyState({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="px-4 py-8 text-center text-xs text-gray-400"
      >
        No data yet. Adjust your filters or run a search.
      </TableCell>
    </TableRow>
  );
}
