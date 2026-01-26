import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GRID_SLOTS, GRID_COLUMNS } from './constants';

interface GridPickerPanelProps<T> {
  items: T[];
  isSelected: (item: T) => boolean;
  onSelect: (item: T) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  renderLabel: (item: T) => React.ReactNode;
}

export function itemButtonClass(selected: boolean) {
  return `py-1.5 rounded-lg text-sm font-medium transition-all ${
    selected
      ? 'bg-gray-200 border-1 border-gray-400 text-gray-700 hover:bg-gray-100'
      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
  }`;
}

function NavButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`flex items-center justify-center rounded-lg py-1.5 transition-colors ${
        disabled
          ? 'cursor-not-allowed text-gray-300'
          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export function GridPickerPanel<T>({
  items,
  isSelected,
  onSelect,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  renderLabel,
}: GridPickerPanelProps<T>) {
  return (
    <div className={`grid grid-cols-${GRID_COLUMNS} gap-2`}>
      {Array.from({ length: GRID_SLOTS }).map((_, index) => {
        if (index === 0) {
          return (
            <NavButton
              key="prev"
              disabled={!canGoPrev}
              onClick={onPrev}
              ariaLabel="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </NavButton>
          );
        }

        if (index === GRID_SLOTS - 1) {
          return (
            <NavButton
              key="next"
              disabled={!canGoNext}
              onClick={onNext}
              ariaLabel="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </NavButton>
          );
        }

        const item = items[index - 1];
        if (!item) return <div key={`empty-${index}`} />;

        const selected = isSelected(item);

        return (
          <button
            key={String(item)}
            type="button"
            onClick={() => onSelect(item)}
            className={itemButtonClass(selected)}
          >
            {renderLabel(item)}
          </button>
        );
      })}
    </div>
  );
}
