/**
 * Centralized API configuration and fetch client.
 * Supports VITE_API_URL for production deployments (e.g. Render, Railway, or VPS)
 * while falling back to relative paths for local development.
 */

// Base URL from environment variable, trimmed of any trailing slash
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

/**
 * Returns the fully-qualified API URL for a given path.
 */
export function getApiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}

/**
 * Wrapper around window.fetch with:
 * - Automatic base URL prepending
 * - Bearer authorization header injection from localStorage (for cross-domain sessions)
 * - Credentials inclusion for cookie support
 * - Content-Type header defaults
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(path);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: options.credentials || "include"
  };

  return fetch(url, fetchOptions);
}
