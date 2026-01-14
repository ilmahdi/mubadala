import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import { ExpandableRow } from './ExpandableRow';
import { DISPLAYED_FIELDS } from './constants';
import { EmptyState } from './EmptyState';

export function DataTableBody({
  table,
  expandedRowId,
  onToggle,
  loading = false,
}: {
  table: any;
  expandedRowId: string | null;
  onToggle: (id: string | null) => void;
  loading?: boolean;
}) {
  const rows = table.getRowModel().rows;

  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={DISPLAYED_FIELDS.size + 1}
            className="px-4 py-8 text-center text-sm text-gray-400"
          >
            Loading…
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (!rows.length) {
    return <EmptyState colSpan={DISPLAYED_FIELDS.size + 1} />;
  }

  return (
    <TableBody>
      {rows.map((row: any) => (
        <ExpandableRow
          key={row.id}
          row={row}
          isOpen={expandedRowId === row.id}
          onToggle={() => onToggle(expandedRowId === row.id ? null : row.id)}
        />
      ))}
    </TableBody>
  );
}
