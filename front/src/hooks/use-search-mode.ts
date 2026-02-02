/**
 * Custom hook for managing search mode with localStorage persistence
 */
import { useState } from 'react';
import {
  SearchMode,
  SEARCH_CONFIG,
  isValidSearchMode,
} from '@/src/lib/search/search-config';

export function useSearchMode() {
  // Lazy initializer: runs only in the browser
  const [mode, setModeState] = useState<SearchMode>(() => {
    if (typeof window === 'undefined') {
      // SSR: always use default
      return SEARCH_CONFIG.defaultMode;
    }

    try {
      const savedMode = localStorage.getItem(SEARCH_CONFIG.storageKey);
      if (savedMode && isValidSearchMode(savedMode)) {
        return savedMode as SearchMode;
      }
    } catch (error) {
      console.warn('Failed to load search mode from localStorage:', error);
    }

    return SEARCH_CONFIG.defaultMode;
  });

  const setMode = (newMode: SearchMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SEARCH_CONFIG.storageKey, newMode);
      } catch (error) {
        console.warn('Failed to save search mode to localStorage:', error);
      }
    }
  };

  return [mode, setMode] as const;
}
