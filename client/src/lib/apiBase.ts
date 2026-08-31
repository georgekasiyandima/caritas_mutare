/**
 * Production talks to Render directly. Vercel's legacy `builds` config does
 * not reliably proxy `/api` (health was still returning index.html).
 * Local CRA keeps using same-origin + the `"proxy"` in package.json.
 */
export function apiUrl(path: string): string {
  const base = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalised}`;
}
