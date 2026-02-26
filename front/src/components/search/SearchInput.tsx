/**
 * Search input component with clear button
 */

import { forwardRef, memo } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  ariaLabel: string;
}

export const SearchInput = memo(
  forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
    { value, onChange, onClear, onKeyDown, placeholder, ariaLabel },
    ref,
  ) {
    return (
      <div className="flex-1">
        <div className="relative flex items-center">
          <SearchIcon
            className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-lg border-0 py-2.5 pl-10 text-sm lowercase',
              'focus:outline-none',
              'placeholder:text-gray-400',
              value ? 'pr-10' : 'pr-4',
            )}
            aria-label={ariaLabel}
            aria-describedby="search-hint"
          />

          {/* Clear Button */}
          {value && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                'absolute right-3 rounded-sm p-0.5',
                'text-gray-400 hover:text-gray-600',
                'transition-colors focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:outline-none',
              )}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Screen reader hint */}
        <p id="search-hint" className="sr-only">
          Press Escape to clear search. Use Ctrl+K to focus search.
        </p>
      </div>
    );
  }),
);
