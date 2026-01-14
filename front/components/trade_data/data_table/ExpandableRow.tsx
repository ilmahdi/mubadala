import { Fragment } from 'react';
import { flexRender } from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { TableCell, TableRow } from '@/components/ui/table';

import { DISPLAYED_FIELDS } from './constants';
import { DetailsGrid } from './DetailsGrid';

const iconClass =
  'rounded-sm border border-brand hover:border-brand/60 hover:text-brand/60';

export function ExpandableRow({
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
      {/* Summary row */}
      <TableRow
        className={`hover:bg-gray-50 ${
          isOpen ? 'border-transparent bg-gray-50/40' : 'border-b'
        }`}
      >
        <TableCell onClick={onToggle} className="text-brand w-8 cursor-pointer">
          {isOpen ? (
            <ChevronUp size={18} className={iconClass} />
          ) : (
            <ChevronDown size={18} className={iconClass} />
          )}
        </TableCell>

        {cells.map((cell: any) => (
          <TableCell key={cell.id} className="h-12 px-2 py-2 text-gray-700">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>

      {/* Expanded row */}
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
