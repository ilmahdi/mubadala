// Use environment variable or fallback to localhost
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Paginated API response structure from Django REST Framework
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * API error response structure
 */
export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

/**
 * Fetch options with common headers
 */
function getFetchOptions(options: RequestInit = {}): RequestInit {
  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
}

/**
 * Handle API errors with proper error messages
 */
async function handleApiError(response: Response): Promise<never> {
  let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

  try {
    const errorData: ApiError = await response.json();
    if (errorData.detail) {
      errorMessage = errorData.detail;
    } else {
      // Collect all field errors
      const fieldErrors = Object.entries(errorData)
        .filter(([key]) => key !== 'detail')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      if (fieldErrors) {
        errorMessage = fieldErrors;
      }
    }
  } catch {
    // If error response is not JSON, use default message
  }

  throw new Error(errorMessage);
}

/**
 * Fetch a single page from the API
 */
export async function fetchPaginated<T>(
  url: string,
): Promise<PaginatedResponse<T>> {
  const response = await fetch(url, getFetchOptions());

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * Generic GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, getFetchOptions());

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * Generic POST request
 */
export async function apiPost<T, D = unknown>(
  endpoint: string,
  data: D,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...getFetchOptions(),
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * Generic PUT request
 */
export async function apiPut<T, D = unknown>(
  endpoint: string,
  data: D,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...getFetchOptions(),
    method: 'PUT',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * Generic PATCH request
 */
export async function apiPatch<T, D = unknown>(
  endpoint: string,
  data: D,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...getFetchOptions(),
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * Generic DELETE request
 */
export async function apiDelete(endpoint: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...getFetchOptions(),
    method: 'DELETE',
  });

  if (!response.ok) {
    await handleApiError(response);
  }
}
