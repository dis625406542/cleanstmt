const DEFAULT_SITE_URL = "https://www.cleanstmt.com";

function normalizeSiteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return DEFAULT_SITE_URL;
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
);

export function absoluteUrl(path: string): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
