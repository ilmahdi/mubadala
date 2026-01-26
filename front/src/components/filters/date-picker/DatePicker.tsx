'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { GridPickerPanel, itemButtonClass } from './GridPickerPanel';
import { DropdownButton } from './DropdownButton';
import { DropdownPanel } from './DropdownPanel';
import { ITEMS_PER_PAGE, MONTH_LABELS, START_YEAR } from './constants';

export type MonthYear = {
  year: number | null;
  month: number | null;
};

interface DatePickerProps {
  label?: string;
  value?: MonthYear;
  onChange?: (value: MonthYear) => void;
}

export default function DatePicker({
  label = 'Year',
  value,
  onChange,
}: DatePickerProps) {
  const now = new Date();
  const currentYear = now.getFullYear();

  const allYears = Array.from(
    { length: currentYear - START_YEAR + 1 },
    (_, i) => START_YEAR + i,
  );

  // Combine year and month into a single state to prevent cascading render warnings
  const [selected, setSelected] = useState<MonthYear>({
    year: value?.year ?? currentYear,
    month: value?.month ?? now.getMonth(),
  });

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const [pageStart, setPageStart] = useState(
    Math.max(0, allYears.length - ITEMS_PER_PAGE),
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const canGoPrev = pageStart > 0;
  const canGoNext = pageStart + ITEMS_PER_PAGE < allYears.length;

  const visibleYears = allYears.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  useEffect(() => {
    if (!value) return;

    // Use startTransition to avoid cascading renders
    startTransition(() => {
      setSelected((prev) =>
        prev.year === value.year && prev.month === value.month
          ? prev
          : { year: value.year, month: value.month },
      );
    });
  }, [value]);

  const closeAll = () => {
    setIsYearOpen(false);
    setIsMonthOpen(false);
  };

  const toggleYear = () => {
    setIsYearOpen((v) => !v);
    setIsMonthOpen(false);
  };

  const toggleMonth = () => {
    if (!selected.year) return;
    setIsMonthOpen((v) => !v);
    setIsYearOpen(false);
  };

  const goPrev = () => {
    if (canGoPrev) setPageStart((p) => Math.max(0, p - ITEMS_PER_PAGE));
  };

  const goNext = () => {
    if (canGoNext)
      setPageStart((p) =>
        Math.min(allYears.length - ITEMS_PER_PAGE, p + ITEMS_PER_PAGE),
      );
  };

  // Close dropdowns on outside click
  useEffect(() => {
    if (!isYearOpen && !isMonthOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        closeAll();
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isYearOpen, isMonthOpen]);

  return (
    <div className="bg-white">
      <h3 className="mb-2 text-xs font-medium text-gray-600">{label}</h3>

      <div ref={dropdownRef} className="relative">
        <div className="flex gap-2">
          <DropdownButton
            value={selected.year}
            placeholder="Select year..."
            onClick={toggleYear}
          />

          <DropdownButton
            value={
              selected.month !== null && selected.year
                ? MONTH_LABELS[selected.month]
                : null
            }
            placeholder="Select month..."
            onClick={toggleMonth}
            disabled={!selected.year}
          />
        </div>

        {isYearOpen && (
          <DropdownPanel>
            <GridPickerPanel
              items={visibleYears}
              isSelected={(y) => y === selected.year}
              onSelect={(y) => {
                setSelected((prev) => ({ ...prev, year: y }));
                onChange?.({ ...selected, year: y });
                closeAll();
              }}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              onPrev={goPrev}
              onNext={goNext}
              renderLabel={(y) => y}
            />
          </DropdownPanel>
        )}

        {isMonthOpen && (
          <DropdownPanel>
            <div className="grid grid-cols-4 gap-2">
              {MONTH_LABELS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => {
                    setSelected((prev) => ({ ...prev, month: i }));
                    onChange?.({ ...selected, month: i });
                    closeAll();
                  }}
                  className={itemButtonClass(selected.month === i)}
                >
                  {label}
                </button>
              ))}
            </div>
          </DropdownPanel>
        )}
      </div>
    </div>
  );
}
