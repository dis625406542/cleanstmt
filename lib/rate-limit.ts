/**
 * Simple in-memory rate limiter.
 * In production with multiple instances, replace with Redis-based limiter.
 */
const ipHits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 10;  // max 10 requests per minute per IP

export function checkRateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const record = ipHits.get(ip);

  if (!record || now > record.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (record.count >= MAX_REQUESTS) {
    return { ok: false, remaining: 0 };
  }

  record.count++;
  return { ok: true, remaining: MAX_REQUESTS - record.count };
}

// Periodically clean up expired entries to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    ipHits.forEach((record, ip) => {
      if (now > record.resetAt) ipHits.delete(ip);
    });
  }, 5 * 60_000);
}
