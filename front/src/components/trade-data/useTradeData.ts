'use client';

import { useEffect, useState, useMemo } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import type { TradeRow } from './columns';
import { getTrades, TradeQueryParams } from '@/src/lib/services/trade.service';
import { PaginatedResponse } from '@/src/lib/api';
import { getSortingStateParser } from '@/src/lib/parsers';

interface UseTradeDataOptions {
  autoFetchAll?: boolean;
  filters?: TradeQueryParams;
}

export function useTradeData(options: UseTradeDataOptions = {}) {
  const { autoFetchAll = false, filters } = options;

  // Read page from URL state
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [sorting] = useQueryState(
    'sort',
    getSortingStateParser<TradeRow>(new Set()).withDefault([]),
  );

  // Read filter parameters from URL state
  const [flowLabel] = useQueryState('flow_label');
  const [continentFilter] = useQueryState('continent');
  const [countryFilter] = useQueryState('country_name');
  const [dateAfter] = useQueryState('date_after');
  const [dateBefore] = useQueryState('date_before');

  const [data, setData] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  // Convert sorting state to Django ordering format
  const ordering = useMemo(() => {
    if (!sorting || !Array.isArray(sorting) || sorting.length === 0) {
      return undefined;
    }

    // Django expects ordering like: "-date" for descending, "date" for ascending
    // Multiple sorts are comma-separated: "-date,country_name"
    return sorting.map((sort) => `${sort.desc ? '-' : ''}${sort.id}`).join(',');
  }, [sorting]);

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
          ordering,
          ...(flowLabel && { flow_label: flowLabel }),
          // Use __in lookup for array filters, otherwise use exact match
          ...(continentFilter && {
            [Array.isArray(continentFilter) && continentFilter.length > 0
              ? 'continent__in'
              : 'continent']: continentFilter,
          }),
          ...(countryFilter && {
            [Array.isArray(countryFilter) && countryFilter.length > 0
              ? 'country_name__in'
              : 'country_name']: countryFilter,
          }),
          ...(dateAfter && { date__gte: dateAfter }),
          ...(dateBefore && { date__lte: dateBefore }),
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
  }, [
    page,
    perPage,
    ordering,
    flowLabel,
    continentFilter,
    countryFilter,
    dateAfter,
    dateBefore,
    autoFetchAll,
    filters,
    filtersKey,
  ]);

  return {
    data,
    loading,
    error,
    totalCount,
    nextPage,
    previousPage,
  };
}
