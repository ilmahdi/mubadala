'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Hash,
  Package,
  ArrowLeftRight,
  Globe,
  Flag,
  Layers,
  Boxes,
  Scale,
  DollarSign,
  Calendar,
  Barcode,
  Tag,
  Box,
} from 'lucide-react';

import { DataTableColumnHeader } from '../data-table/data-table-column-header';
import { cn } from '@/src/lib/utils';
import { CellContext } from '@tanstack/react-table';

export type TradeRow = {
  id: string;
  year: string;
  month: string;
  date: string;
  continent: string;
  country_code: string;
  country_name: string;
  flow_code: string;
  flow_label: string;
  hs_chapter_code: string;
  hs_chapter_label: string;
  hs_product_code: string;
  hs_product_label: string;
  usage_group_code: string;
  usage_group_label: string;
  remarkable_product_code: string;
  remarkable_product_label: string;
  ctci_section_code: string;
  ctci_section_label: string;
  ctci_division_code: string;
  ctci_division_label: string;
  ctci_group_code: string;
  ctci_group_label: string;
  weight_kg: string;
  value_dhs: string;
  supplementary_unit: string;
};

const LANG = 'fr';
export const FLOW_LABELS = {
  fr: {
    'Importations CAF': 'IMP-CAF',
    'Importations en admission temporaire pour perfectionnement actif  sans paiement':
      'IMP-AT-SP',
    'Exportations FAB': 'EXP-FAB',
    'Importations en admission temporaire pour perfectionnement actif  avec paiement':
      'IMP-AT-AP',
    "Réexportations en suite d'admission temporaire pour perfectionnement actif avec paiement":
      'REX-AT-AP',
    "Réexportations en suite d'admission temporaire pour perfectionnement actif sans paiement":
      'REX-AT-SP',
  },
  en: {
    'Importations CAF': 'IMP-CIF',
    'Importations en admission temporaire pour perfectionnement actif  sans paiement':
      'T-IMP-NP',
    'Exportations FAB': 'EXP-FOB',
    'Importations en admission temporaire pour perfectionnement actif  avec paiement':
      'T-IMP-P',
    "Réexportations en suite d'admission temporaire pour perfectionnement actif avec paiement":
      'RE-EXP-P',
    "Réexportations en suite d'admission temporaire pour perfectionnement actif sans paiement":
      'RE-EXP-NP',
  },
} as const;

const FLOW_STYLES: Record<
  string,
  {
    className: string;
  }
> = {
  'Importations CAF': {
    className: 'text-rose-700 bg-rose-50 border border-rose-100',
  },
  'Exportations FAB': {
    className: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
  },
  'Importations en admission temporaire pour perfectionnement actif  sans paiement':
    {
      className: 'text-amber-700 bg-amber-50 border border-amber-100',
    },
  'Importations en admission temporaire pour perfectionnement actif  avec paiement':
    {
      className: 'text-orange-700 bg-orange-50 border border-orange-100',
    },
  "Réexportations en suite d'admission temporaire pour perfectionnement actif avec paiement":
    {
      className: 'text-purple-700 bg-purple-50 border border-purple-100',
    },
  "Réexportations en suite d'admission temporaire pour perfectionnement actif sans paiement":
    {
      className: 'text-blue-700 bg-blue-50 border border-blue-100',
    },
};

const styles = {
  code: 'font-mono text-xs text-gray-700 whitespace-nowrap',
  label: 'text-xs font-medium text-gray-900 whitespace-break-spaces lowercase',
  numeric: 'text-xs text-right tabular-nums font-medium text-gray-900',
  muted: 'text-xs text-gray-500',
  flow: 'text-xs font-medium px-2 py-0 rounded-full',
  continent: 'text-xs font-semibold tracking-wide text-gray-600 uppercase',
};

export const textCell = (className: string) => {
  const Component = <TData,>({ getValue }: CellContext<TData, unknown>) => {
    return <span className={className}>{String(getValue() ?? '')}</span>;
  };
  return Component;
};

export const numericCell = <TData,>({
  getValue,
}: CellContext<TData, unknown>) => {
  return (
    <span className={styles.numeric}>
      {Number(getValue()).toLocaleString()}
    </span>
  );
};

export const flowCell = <TData,>({ getValue }: CellContext<TData, unknown>) => {
  const fullLabel = String(getValue() ?? '');

  const shortLabel =
    FLOW_LABELS[LANG][fullLabel as keyof typeof FLOW_LABELS.fr] ?? fullLabel;

  const flowStyle =
    FLOW_STYLES[fullLabel]?.className ??
    'text-gray-700 bg-gray-50 border border-gray-200';

  return (
    <span title={fullLabel} className={cn(styles.flow, flowStyle)}>
      {shortLabel}
    </span>
  );
};

export const columns: ColumnDef<TradeRow>[] = [
  {
    id: 'hs_product_code',
    accessorKey: 'hs_product_code',
    header: ({ column }) => (
      <DataTableColumnHeader label="HS Code" column={column} title="HS Code" />
    ),
    cell: textCell(styles.code),
    meta: { label: 'HS Code', variant: 'text', icon: Hash },
    enableColumnFilter: true,
  },
  {
    id: 'hs_product_label',
    accessorKey: 'hs_product_label',
    header: ({ column }) => (
      <DataTableColumnHeader label="Product" column={column} title="Product" />
    ),
    cell: textCell(styles.label),
    meta: { label: 'Product', variant: 'text', icon: Package },
    enableColumnFilter: true,
  },
  {
    id: 'flow_label',
    accessorKey: 'flow_label',
    header: ({ column }) => (
      <DataTableColumnHeader label="Flow" column={column} title="Flow" />
    ),
    cell: flowCell,
    meta: { label: 'Flow', variant: 'select', icon: ArrowLeftRight },
    enableColumnFilter: true,
  },
  {
    id: 'flow_code',
    accessorKey: 'flow_code',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Flow Code"
        column={column}
        title="Flow Code"
      />
    ),
    cell: textCell(styles.code),
    meta: { label: 'Flow Code', variant: 'text', icon: Hash },
  },
  {
    id: 'date',
    header: ({ column }) => {
      column.accessorFn = (row) => `${row.month}-${row.year}`;
      return (
        <DataTableColumnHeader label="Date" column={column} title="Date" />
      );
    },
    cell: ({ row }) => (
      <span className={styles.muted}>
        {row.original.month}-{row.original.year}
      </span>
    ),
    meta: { label: 'Date', variant: 'date', icon: Calendar },
  },
  {
    id: 'continent',
    accessorKey: 'continent',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Continent"
        column={column}
        title="Continent"
      />
    ),
    cell: textCell(styles.continent),
    meta: { label: 'Continent', variant: 'select', icon: Globe },
    enableColumnFilter: true,
  },
  {
    id: 'country_code',
    accessorKey: 'country_code',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Country Code"
        column={column}
        title="Country Code"
      />
    ),
    cell: textCell(styles.code),
    meta: { label: 'Country Code', variant: 'text', icon: Flag },
  },
  {
    id: 'country_name',
    accessorKey: 'country_name',
    header: ({ column }) => (
      <DataTableColumnHeader label="Country" column={column} title="Country" />
    ),
    cell: textCell(styles.label),
    meta: { label: 'Country', variant: 'text', icon: Flag },
    enableColumnFilter: true,
  },
  {
    id: 'hs_chapter_code',
    accessorKey: 'hs_chapter_code',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="HS Chapter Code"
        column={column}
        title="HS Chapter Code"
      />
    ),
    cell: textCell(styles.code),
    meta: { label: 'HS Chapter Code', variant: 'text', icon: Barcode },
  },
  {
    id: 'hs_chapter_label',
    accessorKey: 'hs_chapter_label',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="HS Chapter"
        column={column}
        title="HS Chapter"
      />
    ),
    cell: textCell(styles.label),
    meta: { label: 'HS Chapter', variant: 'text', icon: Package },
  },
  {
    id: 'usage_group_code',
    accessorKey: 'usage_group_code',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Usage Code"
        column={column}
        title="Usage Code"
      />
    ),
    cell: textCell(styles.code),
    meta: { label: 'Usage Code', variant: 'text', icon: Tag },
  },
  {
    id: 'usage_group_label',
    accessorKey: 'usage_group_label',
    header: ({ column }) => (
      <DataTableColumnHeader label="Usage" column={column} title="Usage" />
    ),
    cell: textCell(styles.label),
    meta: { label: 'Usage', variant: 'select', icon: Layers },
    enableColumnFilter: true,
  },
  {
    id: 'remarkable_product_code',
    accessorKey: 'remarkable_product_code',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Remarkable Code"
        column={column}
        title="Remarkable Code"
      />
    ),
    cell: textCell(styles.code),
    meta: { label: 'Remarkable Code', variant: 'text', icon: Box },
  },
  {
    id: 'remarkable_product_label',
    accessorKey: 'remarkable_product_label',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Remarkable Product"
        column={column}
        title="Remarkable Product"
      />
    ),
    cell: textCell(styles.label),
    meta: { label: 'Remarkable Product', variant: 'text', icon: Package },
  },
  {
    id: 'ctci_section_code',
    accessorKey: 'ctci_section_code',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="CTCI Section Code"
        column={column}
        title="CTCI Section Code"
      />
    ),
    cell: textCell(styles.code),
    meta: { label: 'CTCI Section Code', variant: 'text', icon: Hash },
  },
  {
    id: 'ctci_section_label',
    accessorKey: 'ctci_section_label',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="CTCI Section"
        column={column}
        title="CTCI Section"
      />
    ),
    cell: textCell(styles.label),
    meta: { label: 'CTCI Section', variant: 'text', icon: Boxes },
  },
  {
    id: 'ctci_division_code',
    accessorKey: 'ctci_division_code',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="CTCI Division Code"
        column={column}
        title="CTCI Division Code"
      />
    ),
    cell: textCell(styles.code),
    meta: { label: 'CTCI Division Code', variant: 'text', icon: Hash },
  },
  {
    id: 'ctci_division_label',
    accessorKey: 'ctci_division_label',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="CTCI Division"
        column={column}
        title="CTCI Division"
      />
    ),
    cell: textCell(styles.label),
    meta: { label: 'CTCI Division', variant: 'text', icon: Boxes },
  },
  {
    id: 'ctci_group_code',
    accessorKey: 'ctci_group_code',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="CTCI Group Code"
        column={column}
        title="CTCI Group Code"
      />
    ),
    cell: textCell(styles.code),
    meta: { label: 'CTCI Group Code', variant: 'text', icon: Hash },
  },
  {
    id: 'ctci_group_label',
    accessorKey: 'ctci_group_label',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="CTCI Group"
        column={column}
        title="CTCI Group"
      />
    ),
    cell: textCell(styles.label),
    meta: { label: 'CTCI Group', variant: 'select', icon: Boxes },
    enableColumnFilter: true,
  },
  {
    id: 'weight_kg',
    accessorKey: 'weight_kg',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Weight (kg)"
        column={column}
        title="Weight (kg)"
      />
    ),
    cell: numericCell,
    meta: { label: 'Weight (kg)', variant: 'number', icon: Scale },
  },
  {
    id: 'value_dhs',
    accessorKey: 'value_dhs',
    header: ({ column }) => (
      <DataTableColumnHeader
        label="Value (MAD)"
        column={column}
        title="Value (MAD)"
      />
    ),
    cell: numericCell,
    meta: { label: 'Value (MAD)', variant: 'number', icon: DollarSign },
  },
  {
    id: 'supplementary_unit',
    accessorKey: 'supplementary_unit',
    header: ({ column }) => (
      <DataTableColumnHeader label="Unit" column={column} title="Unit" />
    ),
    cell: ({ getValue }) => (
      <span className={styles.muted}>{`${getValue() || '—'}`}</span>
    ),
    meta: { label: 'Unit', variant: 'text' },
  },
];
