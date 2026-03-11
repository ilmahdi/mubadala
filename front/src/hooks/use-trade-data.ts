'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
const OFFSET_EXCEEDED_ERROR = 'exceeds the limit';
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

  const [data, setData] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const isMountedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFetchedQueryRef = useRef<string>('');
  const isUpdatingPageRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const advancedFilters = useMemo<ExtendedColumnFilter<TradeRow>[]>(() => {
    const normalizedFilters = Array.isArray(filters) ? filters : [];
    const normalizedSearch = Array.isArray(search) ? search : [];
    return [...normalizedFilters, ...normalizedSearch];
  }, [filters, search]);

  const backendFilterParams = useMemo(() => {
    if (!advancedFilters.length) return {};

    try {
      return buildBackendFilters<TradeRow>(
        advancedFilters,
        joinOperator as JoinOperator,
      );
    } catch (err) {
      console.error('Failed to build backend filters:', err);
      return {};
    }
  }, [advancedFilters, joinOperator]);

  const backendSortingParams = useMemo(() => {
    if (!sort?.length) return undefined;
    return { sort };
  }, [sort]);

  const filterFingerprint = useMemo(
    () => JSON.stringify(backendFilterParams),
    [backendFilterParams],
  );
  const sortFingerprint = useMemo(
    () => JSON.stringify(backendSortingParams),
    [backendSortingParams],
  );

  const paramsRef = useRef({
    filterFingerprint,
    sortFingerprint,
    perPage,
  });

  const effectivePage = useMemo(() => {
    const prev = paramsRef.current;
    const current = { filterFingerprint, sortFingerprint, perPage };

    const hasChanged =
      prev.filterFingerprint !== current.filterFingerprint ||
      prev.sortFingerprint !== current.sortFingerprint ||
      prev.perPage !== current.perPage;

    paramsRef.current = current;

    if (hasChanged && page !== DEFAULT_PAGE) {
      isUpdatingPageRef.current = true;
      return DEFAULT_PAGE;
    }

    return page;
  }, [filterFingerprint, sortFingerprint, perPage, page]);

  useEffect(() => {
    lastFetchedQueryRef.current = '';
  }, [effectivePage]);

  const queryParams = useMemo((): TradeQueryParams => {
    return {
      ...backendFilterParams,
      ...backendSortingParams,
      page: effectivePage,
      page_size: perPage,
    };
  }, [backendFilterParams, backendSortingParams, effectivePage, perPage]);

  const queryKey = useMemo(() => JSON.stringify(queryParams), [queryParams]);

  const fetchTrades = useCallback(async () => {
    if (!isMountedRef.current) return;

    if (queryKey === lastFetchedQueryRef.current) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    lastFetchedQueryRef.current = queryKey;

    try {
      setLoading(true);
      setError(null);

      const response: PaginatedResponse<TradeRow> = await getTrades(
        queryParams,
        abortControllerRef.current.signal,
      );

      if (!abortControllerRef.current.signal.aborted) {
        setData(response.results);
        setTotalCount(response.count);
        setNextPage(response.next);
        setPreviousPage(response.previous);

        if (isUpdatingPageRef.current && page !== DEFAULT_PAGE) {
          isUpdatingPageRef.current = false;
          setTimeout(() => {
            void setPage(DEFAULT_PAGE);
          }, 0);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : '';

      const isPageError =
        errorMessage.toLowerCase().includes(INVALID_PAGE_ERROR) ||
        errorMessage.toLowerCase().includes(OFFSET_EXCEEDED_ERROR);

      if (isPageError) {
        if (page !== DEFAULT_PAGE) {
          lastFetchedQueryRef.current = '';
          void setPage(DEFAULT_PAGE);
        }
        return;
      }

      if (!abortControllerRef.current?.signal.aborted) {
        setError(errorMessage || GENERIC_ERROR_MESSAGE);
        console.error('Error fetching trade data:', err);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [queryKey, queryParams, page, setPage]);

  useEffect(() => {
    void fetchTrades();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchTrades]);

  useEffect(() => {
    if (refetchTrigger > 0) {
      lastFetchedQueryRef.current = '';
    }
  }, [refetchTrigger]);

  const refetch = useCallback(() => {
    lastFetchedQueryRef.current = '';
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
