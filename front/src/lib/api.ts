export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/api';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('auth_token');
}

function getFetchOptions(options: RequestInit = {}): RequestInit {
  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return {
    ...options,
    headers,
  };
}

async function handleApiError(response: Response): Promise<never> {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_token');
    }
    throw new Error('Authentication required. Please sign in.');
  }

  let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

  try {
    const errorData: ApiError = await response.json();
    if (errorData.detail) {
      errorMessage = errorData.detail;
    } else {
      const fieldErrors = Object.entries(errorData)
        .filter(([key]) => key !== 'detail')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      if (fieldErrors) {
        errorMessage = fieldErrors;
      }
    }
  } catch {
    // Use default message if response is not JSON
  }

  throw new Error(errorMessage);
}

export async function fetchPaginated<T>(
  url: string,
): Promise<PaginatedResponse<T>> {
  const response = await fetch(url, getFetchOptions());

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, getFetchOptions());

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

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

export async function apiDelete(endpoint: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...getFetchOptions(),
    method: 'DELETE',
  });

  if (!response.ok) {
    await handleApiError(response);
  }
}
