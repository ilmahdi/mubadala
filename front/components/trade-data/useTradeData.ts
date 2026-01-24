'use client';

import { useEffect, useState } from 'react';
import type { TradeRow } from './columns';
import { API_BASE_URL } from '@/lib/api';

export function useTradeData() {
  const [data, setData] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrades() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/trades/`);

        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }

        const json = (await res.json()) as TradeRow[];

        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
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
  }, []);

  return { data, loading, error };
}
