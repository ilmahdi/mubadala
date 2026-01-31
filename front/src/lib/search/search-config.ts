/**
 * Search configuration for Trade data
 *
 * Centralizes all search-related configuration including modes,
 * field mappings, and validation rules.
 */

export type SearchMode = 'hscode' | 'product' | 'category';

export interface SearchModeConfig {
  key: SearchMode;
  label: string;
  placeholder: string;
  field: string; // Backend field name with lookup
  minChars: number;
  ariaLabel: string;
}

/**
 * Available search modes with backend field mappings
 */
export const SEARCH_MODES: SearchModeConfig[] = [
  {
    key: 'hscode',
    label: 'HS Code',
    placeholder: 'Search by HS Code...',
    field: 'hs_product_code__startswith',
    minChars: 2,
    ariaLabel: 'Search by HS Code',
  },
  {
    key: 'product',
    label: 'Product',
    placeholder: 'Search by product name...',
    field: 'hs_product_label__icontains',
    minChars: 3,
    ariaLabel: 'Search by Product',
  },
  {
    key: 'category',
    label: 'Category',
    placeholder: 'Search by category...',
    field: 'hs_chapter_label__icontains',
    minChars: 3,
    ariaLabel: 'Search by Category',
  },
] as const;

/**
 * Configuration constants
 */
export const SEARCH_CONFIG = {
  debounceMs: 350,
  storageKey: 'jadwa_search_mode',
  defaultMode: 'hscode' as SearchMode,
} as const;

/**
 * Get search mode configuration by key
 */
export function getSearchModeConfig(mode: SearchMode): SearchModeConfig {
  return SEARCH_MODES.find((m) => m.key === mode) ?? SEARCH_MODES[0];
}

/**
 * Validate if a mode is valid
 */
export function isValidSearchMode(mode: string): mode is SearchMode {
  return SEARCH_MODES.some((m) => m.key === mode);
}

/**
 * Get all search field names for backend integration
 */
export function getSearchFieldNames(): string[] {
  return SEARCH_MODES.map((mode) => mode.field);
}
