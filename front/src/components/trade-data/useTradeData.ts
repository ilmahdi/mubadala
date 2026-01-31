'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useQueryState, parseAsInteger, parseAsStringEnum } from 'nuqs';
import type { TradeRow } from './columns';
import { getTrades, TradeQueryParams } from '@/src/lib/services/trade.service';
import { PaginatedResponse } from '@/src/lib/api';
import {
  getSortingStateParser,
  getFiltersStateParser,
} from '@/src/lib/parsers';
import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from '@/src/types/data-table';
import type { JoinOperator } from '@/src/types/filters';
import { buildBackendFilters } from '@/src/lib/filters/filter-builder';

// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const DEFAULT_JOIN_OPERATOR = 'and';
const INVALID_PAGE_ERROR = 'invalid page';
const GENERIC_ERROR_MESSAGE = 'Failed to load trade data';

/**
 * Options for useTradeData hook
 */
interface UseTradeDataOptions {
  /**
   * Whether to fetch all data at once (no pagination)
   * @default false
   */
  autoFetchAll?: boolean;

  /**
   * Additional filters to apply (merged with URL filters)
   */
  filters?: Partial<TradeQueryParams>;
}

/**
 * Return type for useTradeData hook
 */
interface UseTradeDataReturn {
  data: TradeRow[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  nextPage: string | null;
  previousPage: string | null;
  /** Refresh/refetch the data */
  refetch: () => void;
}

/**
 * Custom hook for fetching and managing trade data.
 *
 * Handles pagination, sorting, and filtering state from URL parameters.
 * Integrates with the backend filter system for advanced filtering.
 *
 * @param options - Configuration options
 * @returns Trade data and loading state
 *
 * @example
 * const { data, loading, error, refetch } = useTradeData({
 *   filters: { search: 'wheat' }
 * });
 */
export function useTradeData(
  options: UseTradeDataOptions = {},
): UseTradeDataReturn {
  const { filters: additionalFilters } = options;

  // URL state management
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(DEFAULT_PAGE),
  );
  const [perPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(DEFAULT_PER_PAGE),
  );
  const [sorting] = useQueryState<ExtendedColumnSort<TradeRow>[]>(
    'sort',
    getSortingStateParser<TradeRow>().withDefault([]),
  );
  const [filters_raw] = useQueryState<ExtendedColumnFilter<TradeRow>[]>(
    'filters',
    getFiltersStateParser<TradeRow>().withDefault([]),
  );
  const [joinOperator] = useQueryState(
    'joinOperator',
    parseAsStringEnum(['and', 'or'] as const)
      .withDefault(DEFAULT_JOIN_OPERATOR)
      .withOptions({ clearOnDefault: true, shallow: true }),
  );

  // Parse and normalize filters from URL state
  const advancedFilters: ExtendedColumnFilter<TradeRow>[] = useMemo(
    () => (Array.isArray(filters_raw) ? filters_raw : []),
    [filters_raw],
  );

  const [data, setData] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for client-side hydration before fetching
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    if (isHydrated && page !== DEFAULT_PAGE) {
      void setPage(DEFAULT_PAGE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advancedFilters, isHydrated]);

  // Convert sorting state to Django ordering format
  // Django expects: "-date" for descending, "date" for ascending
  const ordering = useMemo(() => {
    if (!sorting?.length) return undefined;
    return sorting
      .map(
        (sort: ExtendedColumnSort<TradeRow>) =>
          `${sort.desc ? '-' : ''}${sort.id}`,
      )
      .join(',');
  }, [sorting]);

  // Convert frontend filters to backend API params
  const backendFilterParams = useMemo(() => {
    if (!advancedFilters?.length) return {};

    try {
      return buildBackendFilters<TradeRow>(
        advancedFilters,
        joinOperator as JoinOperator,
      );
    } catch (error) {
      console.error('Failed to build backend filters:', error);
      return {};
    }
  }, [advancedFilters, joinOperator]);

  // Build complete query parameters for API request
  const queryParams = useMemo(
    (): TradeQueryParams => ({
      ...additionalFilters,
      ...backendFilterParams,
      page,
      page_size: perPage,
      ordering,
    }),
    [additionalFilters, backendFilterParams, page, perPage, ordering],
  );

  // Fetch trade data from API
  const fetchTrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: PaginatedResponse<TradeRow> =
        await getTrades(queryParams);

      setData(response.results);
      setTotalCount(response.count);
      setNextPage(response.next);
      setPreviousPage(response.previous);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '';

      // Auto-recover from invalid page errors (e.g., when filters reduce results)
      if (errorMessage.toLowerCase().includes(INVALID_PAGE_ERROR)) {
        void setPage(DEFAULT_PAGE);
        return; // Skip error state, let automatic refetch handle it
      }

      // Set error state for all other failures
      setError(errorMessage || GENERIC_ERROR_MESSAGE);
      console.error('Error fetching trade data:', err);
    } finally {
      setLoading(false);
    }
  }, [queryParams, setPage]);

  // Effect to fetch data when parameters change
  useEffect(() => {
    // Only fetch after hydration to ensure URL params are loaded
    if (isHydrated) {
      fetchTrades();
    }
  }, [fetchTrades, refetchTrigger, isHydrated]);

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  return {
    data,
    loading,
    error,
    totalCount,
    nextPage,
    previousPage,
    refetch,
  };
}
