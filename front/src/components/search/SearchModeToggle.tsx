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
    'rounded-md border border-transparent px-3 py-1 text-xs font-medium transition-colors',
    'focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:outline-none',
    isActive
      ? 'bg-brand text-white'
      : 'text-gray-600 hover:bg-gray-50 hover:border-gray-100 border border-gray-100',
  );

export const SearchModeToggle = memo(function SearchModeToggle({
  currentMode,
  onModeChange,
}: SearchModeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-md p-1">
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
