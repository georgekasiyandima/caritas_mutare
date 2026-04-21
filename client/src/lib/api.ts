/**
 * Tiny fetch wrapper for the admin area.
 *
 * Responsibilities:
 *   - Attach the bearer token from localStorage.
 *   - Convert non-2xx JSON responses into thrown `ApiError`s so callers can `try/catch`.
 *   - Expose a download helper for CSV endpoints that streams the file to the browser.
 */

export type Query = Record<string, string | number | boolean | null | undefined>;

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path: string, query?: Query): string {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.append(key, String(value));
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseError(response: Response): Promise<ApiError> {
  let message = `Request failed (${response.status})`;
  let details: unknown;
  try {
    const data = await response.json();
    details = data;
    if (typeof data?.message === 'string') message = data.message;
    else if (Array.isArray(data?.errors) && data.errors.length > 0) {
      message = data.errors.map((err: { msg?: string }) => err.msg).filter(Boolean).join(', ') || message;
    }
  } catch (_err) {
    // Non-JSON body — keep the generic message.
  }
  return new ApiError(message, response.status, details);
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit & { query?: Query } = {}
): Promise<T> {
  const { query, headers, ...rest } = options;
  const response = await fetch(buildUrl(path, query), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(headers || {}),
    },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) return undefined as unknown as T;
  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string, query?: Query) {
  return apiRequest<T>(path, { method: 'GET', query });
}

export function apiPost<T>(path: string, body?: unknown) {
  return apiRequest<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

export function apiPatch<T>(path: string, body?: unknown) {
  return apiRequest<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
}

export function apiDelete<T>(path: string) {
  return apiRequest<T>(path, { method: 'DELETE' });
}

/**
 * Trigger a browser download from a GET endpoint that returns a file (e.g. CSV).
 * Throws an `ApiError` when the server responds with a non-2xx status.
 */
export async function apiDownload(path: string, query?: Query, fallbackFilename = 'download.csv') {
  const response = await fetch(buildUrl(path, query), {
    method: 'GET',
    headers: { ...authHeaders() },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const disposition = response.headers.get('Content-Disposition') || '';
  const match = /filename="?([^";]+)"?/i.exec(disposition);
  const filename = match?.[1] || fallbackFilename;

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
