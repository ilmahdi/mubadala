import { TableBody, TableCell, TableRow } from '@/components/ui/table';

export function EmptyState({ colSpan }: { colSpan: number }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={colSpan}
          className="px-4 py-8 text-center text-xs text-gray-400"
        >
          No data yet. Adjust your filters or run a search.
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
