/** Prefix an internal path with the configured base (GitHub Pages project sites). */
export function withBase(path: string): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const rest = path.replace(/^\/+/, '');
  return `${base}/${rest}`;
}
