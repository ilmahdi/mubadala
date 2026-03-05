import { TableBody, TableRow, TableCell } from '@/src/components/ui/table';
import { DataTableRow } from './data-table-row';
import { Row, Table as TanStackTable } from '@tanstack/react-table';
import { Skeleton } from './data-table-cell-skeleton';

interface DataTableBodyProps<TData> {
  table: TanStackTable<TData>;
  expandedRowId: string | null;
  onToggle: (id: string | null) => void;
  loading?: boolean;
}

export function DataTableBody<TData extends { id: string }>({
  table,
  expandedRowId,
  onToggle,
  loading = false,
}: DataTableBodyProps<TData>) {
  const rows: Row<TData>[] = table.getRowModel().rows;

  if (!rows.length && !loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="px-4 py-8 text-center text-xs text-gray-400"
          >
            No data yet. Adjust your filters or run a search.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  // First-load: no rows yet but loading — render full skeleton rows
  if (!rows.length && loading) {
    const pageSize = table.getState().pagination.pageSize;
    const colCount = table.getVisibleLeafColumns().length;
    return (
      <TableBody>
        {Array.from({ length: pageSize }).map((_, rowIdx) => (
          <TableRow key={rowIdx} className="border-b">
            {/* Expand icon cell */}
            <TableCell className="w-8 px-1">
              <Skeleton className="h-4.5 w-4.5" />
            </TableCell>
            {Array.from({ length: colCount }).map((_, colIdx) => (
              <TableCell key={colIdx} className="h-12 px-2 py-2">
                <Skeleton className="h-3 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <DataTableRow
          key={row.id}
          row={row}
          isOpen={expandedRowId === row.id}
          onToggle={() => onToggle(expandedRowId === row.id ? null : row.id)}
          loading={loading}
        />
      ))}
    </TableBody>
  );
}
