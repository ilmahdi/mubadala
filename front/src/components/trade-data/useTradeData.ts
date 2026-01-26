'use client';

import { useEffect, useState, useMemo } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import type { TradeRow } from './columns';
import { getTrades, TradeQueryParams } from '@/src/lib/services/trade.service';
import { PaginatedResponse } from '@/src/lib/api';

interface UseTradeDataOptions {
  pageSize?: number;
  autoFetchAll?: boolean;
  filters?: TradeQueryParams;
}

export function useTradeData(options: UseTradeDataOptions = {}) {
  const { pageSize = 10, autoFetchAll = false, filters } = options;

  // Read page from URL state
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const [data, setData] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  // Stringify filters to create a stable dependency
  const filtersKey = useMemo(() => JSON.stringify(filters || {}), [filters]);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrades() {
      try {
        setLoading(true);
        setError(null);

        const params: TradeQueryParams = {
          ...(filters || {}),
          page,
          page_size: perPage,
        };

        const response: PaginatedResponse<TradeRow> = await getTrades(params);

        if (isMounted) {
          setData(response.results);
          setTotalCount(response.count);
          setNextPage(response.next);
          setPreviousPage(response.previous);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
          console.error('Error fetching trade data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTrades();

    return () => {
      isMounted = false;
    };
  }, [page, perPage, autoFetchAll, filtersKey]); // Add page and perPage as dependencies

  return {
    data,
    loading,
    error,
    totalCount,
    nextPage,
    previousPage,
  };
}
