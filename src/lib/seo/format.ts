// Formatting helpers safe to use in client components.

const KB = 1024;

export function formatBytes(n: number) {
  if (n < KB) return `${n} B`;
  if (n < KB * KB) return `${Math.round(n / KB)} KB`;
  return `${(n / KB / KB).toFixed(1)} MB`;
}

export function shortUrl(u: string) {
  try {
    const url = new URL(u);
    return url.hostname.replace(/^www\./, "") + (url.pathname === "/" ? "" : url.pathname) + url.search;
  } catch {
    return u;
  }
}
