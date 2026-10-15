/**
 * Search configuration: modes, field mappings, and validation.
 */

import type { BackendFilterOperator, FilterVariant } from '@/src/types/filters';

export type SearchMode = 'hscode' | 'product' | 'category';

export interface SearchModeConfig {
  key: SearchMode;
  label: string;
  placeholder: string;
  minChars: number;
  ariaLabel: string;
}

export interface SearchFilterConfig {
  id: string; // Filter field name
  variant: FilterVariant;
  operator: BackendFilterOperator;
}

/** Available search modes with backend field mappings. */
export const SEARCH_MODES: SearchModeConfig[] = [
  {
    key: 'hscode',
    label: 'HS Code',
    placeholder: 'Search by HS Code...',
    minChars: 2,
    ariaLabel: 'Search by HS Code',
  },
  {
    key: 'product',
    label: 'Product',
    placeholder: 'Search by product name...',
    minChars: 3,
    ariaLabel: 'Search by Product',
  },
  {
    key: 'category',
    label: 'Category',
    placeholder: 'Search by category...',
    minChars: 3,
    ariaLabel: 'Search by Category',
  },
] as const;

/** Filter configurations for search modes. */
const SEARCH_FILTER_CONFIGS: Record<SearchMode, SearchFilterConfig> = {
  hscode: {
    id: 'hs_product_code',
    variant: 'text',
    operator: 'iLike',
  },
  product: {
    id: 'hs_product_label',
    variant: 'text',
    operator: 'iLike',
  },
  category: {
    id: 'hs_chapter_label',
    variant: 'text',
    operator: 'iLike',
  },
};

/** Configuration constants. */
export const SEARCH_CONFIG = {
  debounceMs: 350,
  storageKey: 'mubadala_search_mode',
  defaultMode: 'hscode' as SearchMode,
} as const;

/** Get search mode configuration by key. */
export function getSearchModeConfig(mode: SearchMode): SearchModeConfig {
  return SEARCH_MODES.find((m) => m.key === mode) ?? SEARCH_MODES[0];
}

/** Get filter configuration for search mode. */
export function getSearchFilterConfig(mode: SearchMode): SearchFilterConfig {
  return SEARCH_FILTER_CONFIGS[mode];
}

/** Validate if a mode is valid. */
export function isValidSearchMode(mode: string): mode is SearchMode {
  return SEARCH_MODES.some((m) => m.key === mode);
}
