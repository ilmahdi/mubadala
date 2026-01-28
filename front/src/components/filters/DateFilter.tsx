'use client';

import { useState, useEffect } from 'react';
import { useQueryState } from 'nuqs';
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

function formatDateForAPI(value: MonthYear): string | null {
  if (!isComplete(value)) return null;
  const date = new Date(value.year, value.month, 1);
  return date.toISOString().split('T')[0];
}

function parseDateFromAPI(dateStr: string | null): MonthYear {
  if (!dateStr) return { year: null, month: null };
  const date = new Date(dateStr);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export default function DateFilter() {
  const [dateAfter, setDateAfter] = useQueryState('date_after');
  const [dateBefore, setDateBefore] = useQueryState('date_before');

  const [from, setFrom] = useState<MonthYear>(parseDateFromAPI(dateAfter));
  const [to, setTo] = useState<MonthYear>(parseDateFromAPI(dateBefore));

  // Sync local state with URL state on mount
  useEffect(() => {
    if (dateAfter) setFrom(parseDateFromAPI(dateAfter));
    if (dateBefore) setTo(parseDateFromAPI(dateBefore));
  }, []);

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
            if (!isComplete(to)) setTo(next);
            const formatted = formatDateForAPI(next);
            setDateAfter(formatted);
          }}
        />
        <DatePicker
          label="TO"
          value={to}
          onChange={(next) => {
            setTo(next);
            const formatted = formatDateForAPI(next);
            setDateBefore(formatted);
          }}
        />
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
