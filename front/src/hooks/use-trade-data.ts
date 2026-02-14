'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useQueryState, parseAsInteger, parseAsStringEnum } from 'nuqs';
import type { TradeRow } from '../components/trade-data/columns';
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
 * Custom hook for fetching trade data with pagination, sorting, and filtering.
 * Manages state from URL parameters and integrates with backend filter system.
 */
export function useTradeData(): UseTradeDataReturn {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(DEFAULT_PAGE),
  );
  const [perPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(DEFAULT_PER_PAGE),
  );
  const [sort] = useQueryState<ExtendedColumnSort<TradeRow>[]>(
    'sort',
    getSortingStateParser<TradeRow>().withDefault([]),
  );
  const [filters] = useQueryState<ExtendedColumnFilter<TradeRow>[]>(
    'filters',
    getFiltersStateParser<TradeRow>().withDefault([]),
  );
  const [search] = useQueryState<ExtendedColumnFilter<TradeRow>[]>(
    'search',
    getFiltersStateParser<TradeRow>().withDefault([]),
  );
  const [joinOperator] = useQueryState(
    'joinOperator',
    parseAsStringEnum(['and', 'or'] as const)
      .withDefault(DEFAULT_JOIN_OPERATOR)
      .withOptions({ clearOnDefault: true, shallow: true }),
  );

  const normalizedFilters: ExtendedColumnFilter<TradeRow>[] = useMemo(
    () => (Array.isArray(filters) ? filters : []),
    [filters],
  );

  const normalizedSearch: ExtendedColumnFilter<TradeRow>[] = useMemo(
    () => (Array.isArray(search) ? search : []),
    [search],
  );

  const advancedFilters: ExtendedColumnFilter<TradeRow>[] = useMemo(
    () => [...normalizedFilters, ...normalizedSearch],
    [normalizedFilters, normalizedSearch],
  );

  const [data, setData] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && page !== DEFAULT_PAGE) {
      void setPage(DEFAULT_PAGE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedFilters, normalizedSearch, isHydrated]);

  const backendSortingParams = useMemo(() => {
    if (!sort?.length) return undefined;
    return {
      sort,
    };
  }, [sort]);

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

  const queryParams = useMemo((): TradeQueryParams => {
    return {
      ...backendFilterParams,
      ...backendSortingParams,
      page,
      page_size: perPage,
    };
  }, [backendFilterParams, backendSortingParams, page, perPage]);

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

      if (errorMessage.toLowerCase().includes(INVALID_PAGE_ERROR)) {
        void setPage(DEFAULT_PAGE);
        return;
      }

      setError(errorMessage || GENERIC_ERROR_MESSAGE);
      console.error('Error fetching trade data:', err);
    } finally {
      setLoading(false);
    }
  }, [queryParams, setPage]);

  useEffect(() => {
    if (isHydrated) {
      fetchTrades();
    }
  }, [fetchTrades, refetchTrigger, isHydrated]);

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
