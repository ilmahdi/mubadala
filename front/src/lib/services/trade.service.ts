import { TradeRow } from '@/src/components/trade-data/columns';
import {
  API_BASE_URL,
  PaginatedResponse,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
} from '../api';
import type { BackendFilterParams } from '@/src/types/filters';

export interface TradeBaseParams {
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}

export interface TradeQueryParams extends TradeBaseParams, BackendFilterParams {
  [key: string]: object | string | number | undefined;
}

function buildQueryString(params: TradeQueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Handle array values (for filters like continent, country)
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item) searchParams.append(key, String(item));
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export async function getTrades(
  data?: TradeQueryParams,
  signal?: AbortSignal,
): Promise<PaginatedResponse<TradeRow>> {
  return apiPost<PaginatedResponse<TradeRow>>('/trades/', data, signal);
}

export async function getTrade(id: number): Promise<TradeRow> {
  return apiGet<TradeRow>(`/trades/${id}/`);
}

export async function createTrade(data: Partial<TradeRow>): Promise<TradeRow> {
  return apiPost<TradeRow, Partial<TradeRow>>('/trades/', data);
}

export async function updateTrade(
  id: number,
  data: Partial<TradeRow>,
): Promise<TradeRow> {
  return apiPut<TradeRow, Partial<TradeRow>>(`/trades/${id}/`, data);
}

export async function patchTrade(
  id: number,
  data: Partial<TradeRow>,
): Promise<TradeRow> {
  return apiPatch<TradeRow, Partial<TradeRow>>(`/trades/${id}/`, data);
}

export async function deleteTrade(id: number): Promise<void> {
  return apiDelete(`/trades/${id}/`);
}

export async function exportTradesToCSV(
  params?: TradeQueryParams,
): Promise<Blob> {
  const queryString = buildQueryString(params || {});
  const url = `${API_BASE_URL}/trades/export/${queryString}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'text/csv',
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.status} ${response.statusText}`);
  }

  return response.blob();
}
