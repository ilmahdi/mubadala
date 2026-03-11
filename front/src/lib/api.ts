import { signOut } from 'next-auth/react';

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

/**
 * Retrieve the Backend JWT access token from the NextAuth session.
 *
 * The token is stored in the encrypted NextAuth session cookie (HttpOnly,
 * SameSite=Lax) and surfaced to the client via the `session` callback in
 * `src/lib/auth.ts`.  This function reads it from the session object that
 * NextAuth exposes on `window.__nextauth_session` via the `useSession` hook
 * — but since `api.ts` is also called from non-React contexts we fall back to
 * a small in-memory cache that `AuthProvider` populates via `useAuth`.
 *
 * For simplicity in this architecture the token is kept in a module-level
 * variable that is updated by the `useAuth` hook on every session refresh.
 * This is safe because:
 *  - It only lives in the browser's JS heap (not persisted storage).
 *  - It is replaced/cleared whenever the session changes.
 *  - The actual session cookie (containing the encrypted refresh token) is
 *    HttpOnly and inaccessible to scripts.
 */
let _backendAccessToken: string | null = null;

/** Called by `useAuth` on every session update. */
export function setBackendAccessToken(token: string | null): void {
  _backendAccessToken = token;
}

function getAuthToken(): string | null {
  return _backendAccessToken;
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
    signOut({ callbackUrl: '/auth/signin' });
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
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...getFetchOptions({ signal }),
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
