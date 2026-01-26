'use client';

import { useState } from 'react';
import DatePicker, { type MonthYear } from './date-picker/DatePicker';

function isComplete(
  value: MonthYear,
): value is { year: number; month: number } {
  return value.year !== null && value.month !== null;
}

function compareMonthYear(a: MonthYear, b: MonthYear): number {
  if (!isComplete(a) || !isComplete(b)) return 0;
  const aIndex = a.year * 12 + a.month;
  const bIndex = b.year * 12 + b.month;
  return aIndex - bIndex;
}

function formatMonthYear(value: MonthYear): string | null {
  if (!isComplete(value)) return null;
  const date = new Date(value.year, value.month, 1);
  return date.toLocaleString('en', { month: 'short', year: 'numeric' });
}

export default function DateFilter() {
  const [from, setFrom] = useState<MonthYear>({
    year: new Date().getFullYear(),
    month: 0,
  });
  const [to, setTo] = useState<MonthYear>({
    year: new Date().getFullYear(),
    month: 0,
  });

  const hasRange = isComplete(from) && isComplete(to);
  const isInvalidRange = hasRange && compareMonthYear(to, from) < 0;

  return (
    <div className="bg-white">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium">Date range</label>
      </div>

      <div className="flex flex-col gap-2">
        <DatePicker
          label="FROM"
          value={from}
          onChange={(next) => {
            setFrom(next);
            setTo(next);
          }}
        />
        <DatePicker label="TO" value={to} onChange={(next) => setTo(next)} />
      </div>

      {isInvalidRange && (
        <p className="mt-2 text-xs text-red-500">
          End date must be after start date.
        </p>
      )}

      {!isInvalidRange && hasRange && (
        <p className="mt-2 text-xs text-gray-500">
          Selected: {formatMonthYear(from)} – {formatMonthYear(to)}
        </p>
      )}
    </div>
  );
}
