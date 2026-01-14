import { DETAILS_CONFIG } from './constants';

type AnyRecord = Record<string, any>;

export function DetailsGrid({ row }: { row: AnyRecord }) {
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
      <span className="text-xs font-medium whitespace-break-spaces text-gray-600 lowercase">
        {value}
      </span>
    </div>
  );
}
