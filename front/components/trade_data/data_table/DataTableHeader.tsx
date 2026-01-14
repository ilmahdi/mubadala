import { flexRender } from '@tanstack/react-table';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DataTableHeader({ headers }: { headers: any[] }) {
  return (
    <TableHeader className="bg-gray-100">
      <TableRow>
        {/* Empty cell for expandable icon column */}
        <TableHead className="w-8" />

        {headers.map((header) => (
          <TableHead
            key={header.id}
            className="font-regular px-2 py-2 text-xs tracking-wide text-gray-600 uppercase"
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
