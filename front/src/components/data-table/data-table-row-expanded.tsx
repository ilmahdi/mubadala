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

interface DataTableRowExpandedProps<TData extends Record<string, unknown>> {
  row: TData;
}

export function DataTableRowExpanded<TData extends Record<string, unknown>>({
  row,
}: DataTableRowExpandedProps<TData>) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
      {DETAILS_CONFIG.map(({ label, key }) => (
        <Detail
          key={key}
          label={label}
          value={`${row[`${key}_code` as keyof TData] ?? ''} – ${
            row[`${key}_label` as keyof TData] ?? ''
          }`}
        />
      ))}

      <Detail label="Continent" value={(row.continent as string) ?? ''} />
      <Detail
        label="Complementary Unit"
        value={(row.supplementary_unit as string) || '—'}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col border-l-2 border-gray-100 bg-gray-50 p-2">
      <span className="font-regular text-xs text-gray-400">{label}</span>
      <span className="text-xs font-medium whitespace-break-spaces text-gray-600 lowercase">
        {value}
      </span>
    </div>
  );
}
