'use client';

import { useCallback, useState, useRef } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { useDebouncedCallback } from '@/src/hooks/use-debounced-callback';
import { useSearchMode } from '@/src/hooks/use-search-mode';
import { useKeyboardShortcut } from '@/src/hooks/use-keyboard-shortcut';
import {
  SearchMode,
  getSearchModeConfig,
  SEARCH_CONFIG,
} from '@/src/lib/search/search-config';
import { SearchModeToggle } from '@/src/components/search/SearchModeToggle';
import { SearchInput } from '@/src/components/search/SearchInput';
import { SearchStatusIndicator } from '@/src/components/search/SearchStatusIndicator';

/**
 * Main search component with backend integration.
 *
 * Features:
 * - Multiple search modes (HS Code, Product, Category)
 * - URL state management via nuqs
 * - Debounced input for performance
 * - Persists selected mode to localStorage
 * - Keyboard shortcuts (Ctrl+K to focus, Escape to clear)
 * - Accessibility compliant
 */
export default function Search() {
  const [mode, setMode] = useSearchMode();
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMode = getSearchModeConfig(mode);

  // URL state for the search parameter
  const [urlSearchValue, setUrlSearchValue] = useQueryState(
    currentMode.field,
    parseAsString.withDefault('').withOptions({
      history: 'replace',
      shallow: true,
      clearOnDefault: true,
    }),
  );

  // Derive local state from URL state (no useState needed)
  const [searchText, setSearchText] = useState(urlSearchValue || '');

  // Debounced URL update
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    if (value.length >= currentMode.minChars || value.length === 0) {
      void setUrlSearchValue(value || null);
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

      void setUrlSearchValue(null);
      setMode(newMode);
      setSearchText('');
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [mode, setMode, setUrlSearchValue],
  );

  const handleClear = useCallback(() => {
    setSearchText('');
    void setUrlSearchValue(null);
    inputRef.current?.focus();
  }, [setUrlSearchValue]);

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
      className="flex items-center rounded-md border border-gray-100 bg-white px-2 py-1"
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
