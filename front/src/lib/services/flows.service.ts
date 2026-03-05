import { apiGet, PaginatedResponse } from '../api';

/**
 * Flow data structure from backend API
 */
export interface Flow {
  flow_label: string;
  flow_code: string;
}

/**
 * Fetch all flows from the backend
 * Returns array of flows with label and code
 *
 * @returns Promise resolving to array of Flow objects
 * @throws Error if API request fails
 */
export async function getFlows(): Promise<Flow[]> {
  try {
    const response = await apiGet<PaginatedResponse<Flow>>('/flows/');
    return response.results;
  } catch (error) {
    console.error('Failed to fetch flows:', error);
    throw error;
  }
}

/**
 * Transform flows into option format for filters/dropdowns
 *
 * @param flows - Array of Flow objects
 * @returns Array of options with label and value
 */
export function flowsToOptions(flows: Flow[]) {
  return flows.map((flow) => ({
    label: flow.flow_label,
    value: flow.flow_code,
  }));
}
