'use client';

import { useCallback, useState, useRef, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { useDebouncedCallback } from '@/src/hooks/use-debounced-callback';
import { useSearchMode } from '@/src/hooks/use-search-mode';
import { useKeyboardShortcut } from '@/src/hooks/use-keyboard-shortcut';
import {
  SearchMode,
  getSearchModeConfig,
  SEARCH_CONFIG,
  getSearchFilterConfig,
} from '@/src/lib/search/search-config';
import { SearchModeToggle } from '@/src/components/search/SearchModeToggle';
import { SearchInput } from '@/src/components/search/SearchInput';
import { SearchStatusIndicator } from '@/src/components/search/SearchStatusIndicator';
import { searchStyles } from '@/src/config/component-styles';
import { getFiltersStateParser } from '@/src/lib/parsers';
import type { ExtendedColumnFilter } from '@/src/types/data-table';
import type { TradeRow } from '@/src/components/trade-data/columns';

const SEARCH_FILTER_ID = '__search__';

/**
 * Main search component with multiple modes (HS Code, Product, Category).
 * Integrates with unified filter system using 'filters' URL param.
 */
export default function Search() {
  const [mode, setMode] = useSearchMode();
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMode = getSearchModeConfig(mode);
  const filterConfig = getSearchFilterConfig(mode);

  // Get filters from URL
  const [filters, setFilters] = useQueryState<ExtendedColumnFilter<TradeRow>[]>(
    'search',
    getFiltersStateParser<TradeRow>().withDefault([]).withOptions({
      history: 'replace',
      shallow: true,
      clearOnDefault: true,
    }),
  );

  // Find existing search filter
  const searchFilter = useMemo(
    () => filters?.find((f) => f.filterId === SEARCH_FILTER_ID),
    [filters],
  );

  // Derive local state from filters
  const [searchText, setSearchText] = useState(
    (searchFilter?.value as string) || '',
  );

  // Debounced filter update
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    if (value.length >= currentMode.minChars || value.length === 0) {
      const otherFilters =
        filters?.filter((f) => f.filterId !== SEARCH_FILTER_ID) || [];

      if (value) {
        // Add/update search filter
        const newFilter: ExtendedColumnFilter<TradeRow> = {
          id: filterConfig.id as keyof TradeRow,
          value,
          variant: filterConfig.variant,
          operator: filterConfig.operator,
          filterId: SEARCH_FILTER_ID,
        };
        void setFilters([...otherFilters, newFilter]);
      } else {
        // Remove search filter
        void setFilters(otherFilters.length > 0 ? otherFilters : null);
      }
    }
  }, SEARCH_CONFIG.debounceMs);

  // Event handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchText(newValue);
      debouncedSetSearch(newValue);
    },
    [debouncedSetSearch],
  );

  const handleModeChange = useCallback(
    (newMode: SearchMode) => {
      if (newMode === mode) return;

      // Remove search filter when changing modes
      const otherFilters =
        filters?.filter((f) => f.filterId !== SEARCH_FILTER_ID) || [];
      void setFilters(otherFilters.length > 0 ? otherFilters : null);
      setMode(newMode);
      setSearchText('');
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [mode, setMode, filters, setFilters],
  );

  const handleClear = useCallback(() => {
    setSearchText('');
    const otherFilters =
      filters?.filter((f) => f.filterId !== SEARCH_FILTER_ID) || [];
    void setFilters(otherFilters.length > 0 ? otherFilters : null);
    inputRef.current?.focus();
  }, [filters, setFilters]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        handleClear();
      }
    },
    [handleClear],
  );

  // Keyboard shortcuts
  useKeyboardShortcut([
    {
      key: 'k',
      ctrl: true,
      meta: true,
      callback: () => inputRef.current?.focus(),
    },
  ]);

  return (
    <div
      className={searchStyles.container}
      role="search"
      aria-label="Trade data search"
    >
      <SearchModeToggle currentMode={mode} onModeChange={handleModeChange} />

      <SearchInput
        ref={inputRef}
        value={searchText}
        onChange={handleSearchChange}
        onClear={handleClear}
        onKeyDown={handleKeyDown}
        placeholder={currentMode.placeholder}
        ariaLabel={`${currentMode.label} search input`}
      />

      <SearchStatusIndicator
        currentLength={searchText.length}
        minChars={currentMode.minChars}
      />
    </div>
  );
}
