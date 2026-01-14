import { ColumnDef } from '@tanstack/react-table';

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  loading?: boolean;
};

export type AnyRecord = Record<string, any>;
