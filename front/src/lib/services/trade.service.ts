import { TradeRow } from '@/src/components/trade-data/columns';
import {
  API_BASE_URL,
  fetchPaginated,
  PaginatedResponse,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
} from '../api';

/**
 * Trade API query parameters
 */
export interface TradeQueryParams {
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
  // Filtering
  date_after?: string;
  date_before?: string;
  continent?: string;
  country_name?: string;
  flow_label?: string;
  hs_product_code?: string;
  // Add more filters as needed
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: TradeQueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Fetch trades (single page)
 */
export async function getTrades(
  params?: TradeQueryParams,
): Promise<PaginatedResponse<TradeRow>> {
  const queryString = buildQueryString(params || {});
  const url = `${API_BASE_URL}/trades/${queryString}`;
  return fetchPaginated<TradeRow>(url);
}

/**
 * Fetch a single trade by ID
 */
export async function getTrade(id: number): Promise<TradeRow> {
  return apiGet<TradeRow>(`/trades/${id}/`);
}

/**
 * Create a new trade
 */
export async function createTrade(data: Partial<TradeRow>): Promise<TradeRow> {
  return apiPost<TradeRow, Partial<TradeRow>>('/trades/', data);
}

/**
 * Update a trade (full update)
 */
export async function updateTrade(
  id: number,
  data: Partial<TradeRow>,
): Promise<TradeRow> {
  return apiPut<TradeRow, Partial<TradeRow>>(`/trades/${id}/`, data);
}

/**
 * Partially update a trade
 */
export async function patchTrade(
  id: number,
  data: Partial<TradeRow>,
): Promise<TradeRow> {
  return apiPatch<TradeRow, Partial<TradeRow>>(`/trades/${id}/`, data);
}

/**
 * Delete a trade
 */
export async function deleteTrade(id: number): Promise<void> {
  return apiDelete(`/trades/${id}/`);
}

/**
 * Export trades to CSV
 */
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
