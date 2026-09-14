/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Each (clientId, action) pair tracks timestamps of recent requests.
 * Old entries outside the window are pruned on every check.
 */

interface RateLimitConfig {
  /** Maximum number of requests allowed inside the window. */
  maxRequests: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  /** Milliseconds until the client can retry (only set when blocked). */
  retryAfterMs?: number;
}

// ── Per-action default limits ──────────────────────────────────────────────────

export const RATE_LIMIT_GENERATE_QUESTIONS: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60_000, // 10 requests per minute
};

export const RATE_LIMIT_EVALUATE_ANSWER: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60_000, // 30 requests per minute
};

export const RATE_LIMIT_FINAL_REPORT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60_000, // 5 requests per minute
};

// ── In-memory store ────────────────────────────────────────────────────────────

const store = new Map<string, number[]>();

/**
 * Checks whether a request from `clientId` performing `action` is within the
 * configured rate limit.  Returns `{ allowed: true }` or
 * `{ allowed: false, retryAfterMs }`.
 */
export function checkRateLimit(
  clientId: string,
  action: string,
  config: RateLimitConfig,
): RateLimitResult {
  const key = `${clientId}:${action}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let timestamps = store.get(key) ?? [];

  // Prune entries outside the current window
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= config.maxRequests) {
    // Earliest timestamp still inside the window determines when a slot opens
    const earliest = timestamps[0]!;
    const retryAfterMs = earliest + config.windowMs - now;

    store.set(key, timestamps);
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) };
  }

  timestamps.push(now);
  store.set(key, timestamps);
  return { allowed: true };
}

/**
 * Extracts a best-effort client identifier from the request headers.
 * Falls back to "anonymous" when no identifiable header is present.
 */
export function getClientIdentifier(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "anonymous"
  );
}
