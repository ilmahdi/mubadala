/**
 * Custom hook for managing search mode with localStorage persistence
 */

import { useState } from 'react';
import {
  SearchMode,
  SEARCH_CONFIG,
  isValidSearchMode,
} from '@/src/lib/search/search-config';

/**
 * Get initial mode from localStorage or use default
 */
function getInitialMode(): SearchMode {
  try {
    const savedMode = localStorage.getItem(SEARCH_CONFIG.storageKey);
    if (savedMode && isValidSearchMode(savedMode)) {
      return savedMode;
    }
  } catch (error) {
    console.warn('Failed to load search mode from localStorage:', error);
  }
  return SEARCH_CONFIG.defaultMode;
}

/**
 * Hook to manage search mode with localStorage persistence
 *
 * @returns Current mode and setter function
 *
 * @example
 * const [mode, setMode] = useSearchMode();
 */
export function useSearchMode() {
  // Use lazy initializer to load from localStorage only once on mount
  const [mode, setModeState] = useState<SearchMode>(getInitialMode);

  // Wrapper to persist mode changes
  const setMode = (newMode: SearchMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(SEARCH_CONFIG.storageKey, newMode);
    } catch (error) {
      console.warn('Failed to save search mode to localStorage:', error);
    }
  };

  return [mode, setMode] as const;
}
