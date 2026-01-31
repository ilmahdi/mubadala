/**
 * Search mode toggle component
 *
 * Displays buttons to switch between different search modes.
 */

import { memo } from 'react';
import { cn } from '@/src/lib/utils';
import { SearchMode, SEARCH_MODES } from '@/src/lib/search/search-config';

interface SearchModeToggleProps {
  currentMode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
}

/**
 * Button styles helper
 */
const getButtonClass = (isActive: boolean) =>
  cn(
    'rounded-md px-3 py-1 text-xs font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-1',
    isActive
      ? 'bg-brand text-white shadow-sm'
      : 'text-gray-600 hover:bg-brand/5 hover:text-brand',
  );

export const SearchModeToggle = memo(function SearchModeToggle({
  currentMode,
  onModeChange,
}: SearchModeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-md bg-gray-50 p-1">
      {SEARCH_MODES.map(({ key, label, ariaLabel }) => (
        <button
          key={key}
          type="button"
          onClick={() => onModeChange(key)}
          className={getButtonClass(currentMode === key)}
          aria-pressed={currentMode === key}
          aria-label={ariaLabel}
        >
          {label}
        </button>
      ))}
    </div>
  );
});
