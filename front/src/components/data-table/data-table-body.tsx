import { TableBody, TableRow, TableCell } from '@/src/components/ui/table';
import { DataTableRow } from './data-table-row';
import { Row, Table as TanStackTable } from '@tanstack/react-table';

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

  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="px-4 py-8 text-center text-sm text-gray-400"
          >
            Loading…
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (!rows.length) {
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

  return (
    <TableBody>
      {rows.map((row) => (
        <DataTableRow
          key={row.id}
          row={row}
          isOpen={expandedRowId === row.id}
          onToggle={() => onToggle(expandedRowId === row.id ? null : row.id)}
        />
      ))}
    </TableBody>
  );
}
