/**
 * Utility for managing search URL parameters
 *
 * Provides hooks and utilities to read search parameters from URL
 * and integrate them with the trade data fetching system.
 */

import { useQueryState, parseAsString } from 'nuqs';

/**
 * Search parameters read from URL
 */
export interface SearchParams {
  hsCodeSearch: string;
  productSearch: string;
  categorySearch: string;
}

/**
 * Hook to read all search parameters from URL
 *
 * @returns Object with all active search parameters
 */
export function useSearch(): SearchParams {
  const [hsCodeSearch] = useQueryState(
    'hs_product_code__startswith',
    parseAsString.withDefault(''),
  );
  const [productSearch] = useQueryState(
    'hs_product_label__icontains',
    parseAsString.withDefault(''),
  );
  const [categorySearch] = useQueryState(
    'hs_chapter_label__icontains',
    parseAsString.withDefault(''),
  );

  return {
    hsCodeSearch,
    productSearch,
    categorySearch,
  };
}

/**
 * Convert search params to API query parameters
 *
 * @param searchParams - Search parameters from URL
 * @returns Object with non-empty search params
 */
export function searchParamsToQueryParams(
  searchParams: SearchParams,
): Record<string, string> {
  const queryParams: Record<string, string> = {};

  if (searchParams.hsCodeSearch) {
    queryParams['hs_product_code__startswith'] = searchParams.hsCodeSearch;
  }
  if (searchParams.productSearch) {
    queryParams['hs_product_label__icontains'] = searchParams.productSearch;
  }
  if (searchParams.categorySearch) {
    queryParams['hs_chapter_label__icontains'] = searchParams.categorySearch;
  }

  return queryParams;
}

/**
 * Check if any search parameter is active
 *
 * @param searchParams - Search parameters to check
 * @returns True if any search is active
 */
export function hasActiveSearch(searchParams: SearchParams): boolean {
  return !!(
    searchParams.hsCodeSearch ||
    searchParams.productSearch ||
    searchParams.categorySearch
  );
}
