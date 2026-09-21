/**
 * In-memory sliding window rate limiter for API abuse prevention.
 *
 * Uses a Map-based token bucket with automatic cleanup. Each client (identified by IP)
 * gets a configurable number of requests per time window. Exceeding the limit returns
 * a structured error response.
 *
 * NOTE: This is process-local — suitable for single-instance deployments and Vercel
 * serverless (where each cold start resets). For multi-instance/horizontal scaling,
 * replace with Redis-backed rate limiting (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  /** Timestamps of requests within the current window */
  timestamps: number[];
}

interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

/** Global store: keyed by `${routeKey}:${clientIdentifier}` */
const rateLimitStore = new Map<string, RateLimitEntry>();

/** Cleanup stale entries every 60 seconds to prevent memory leaks */
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, entry] of rateLimitStore) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Checks and consumes a rate limit token for the given client + route.
 *
 * @returns `{ allowed: true, remaining }` if under limit,
 *          `{ allowed: false, remaining: 0, retryAfterMs }` if over limit.
 */
export function checkRateLimit(
  clientIdentifier: string,
  routeKey: string,
  config: RateLimitConfig
): {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
} {
  const now = Date.now();
  const storeKey = `${routeKey}:${clientIdentifier}`;
  const cutoff = now - config.windowMs;

  // Periodic cleanup
  cleanupStaleEntries(config.windowMs);

  let entry = rateLimitStore.get(storeKey);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitStore.set(storeKey, entry);
  }

  // Prune timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= config.maxRequests) {
    // Find when the oldest request in the window expires
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + config.windowMs - now;

    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, retryAfterMs),
    };
  }

  // Consume a token
  entry.timestamps.push(now);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
  };
}

/**
 * Extracts a client identifier from request headers.
 * Uses X-Forwarded-For (load balancer/CDN), falling back to X-Real-IP, then "anonymous".
 */
export function getClientIdentifier(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // Take the first IP (original client) from the chain
    return forwarded.split(",")[0].trim();
  }
  return headers.get("x-real-ip") || "anonymous";
}

// ── Pre-configured rate limit profiles for Gemini AI endpoints ──────────────

/** Resume analysis: 10 requests per 60 seconds per client */
export const RATE_LIMIT_ANALYZE_RESUME: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60_000,
};

/** Interview question generation: 8 requests per 60 seconds per client */
export const RATE_LIMIT_GENERATE_QUESTIONS: RateLimitConfig = {
  maxRequests: 8,
  windowMs: 60_000,
};

/** Answer evaluation: 15 requests per 60 seconds per client */
export const RATE_LIMIT_EVALUATE_ANSWER: RateLimitConfig = {
  maxRequests: 15,
  windowMs: 60_000,
};

/** Resume optimization: 8 requests per 60 seconds per client */
export const RATE_LIMIT_OPTIMIZE_RESUME: RateLimitConfig = {
  maxRequests: 8,
  windowMs: 60_000,
};

/** Chat endpoint: 20 requests per 60 seconds per client */
export const RATE_LIMIT_CHAT: RateLimitConfig = {
  maxRequests: 20,
  windowMs: 60_000,
};

/** Final report generation: 6 requests per 60 seconds per client */
export const RATE_LIMIT_FINAL_REPORT: RateLimitConfig = {
  maxRequests: 6,
  windowMs: 60_000,
};
