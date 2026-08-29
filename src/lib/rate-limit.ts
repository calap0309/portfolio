type Entry = { count: number; reset: number };

const globalStore = globalThis as unknown as {
  __rateLimitStore?: Map<string, Entry>;
};

// Persist across hot-reloads in dev; isolated per server instance in prod.
const store: Map<string, Entry> =
  globalStore.__rateLimitStore ?? new Map<string, Entry>();
if (!globalStore.__rateLimitStore) globalStore.__rateLimitStore = store;

export interface RateLimitOptions {
  /** Window size in ms (default 10 min). */
  windowMs?: number;
  /** Max requests per window (default 5). */
  limit?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  // Next.js on Vercel also sets x-vercel-forwarded-for
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0]?.trim() ?? "unknown";
  return "unknown";
}

export function checkRateLimit(
  request: Request,
  opts: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = opts.windowMs ?? 10 * 60 * 1000;
  const limit = opts.limit ?? 5;
  const ip = getClientIp(request);
  const now = Date.now();

  const entry = store.get(ip);

  if (!entry || now > entry.reset) {
    store.set(ip, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: entry.reset - now,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: limit - entry.count,
    retryAfterMs: 0,
  };
}

// Optional cleanup to avoid unbounded growth (call periodically or on check).
function prune() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.reset) store.delete(key);
  }
}

// Prune every 5 minutes; unref so it doesn't keep process alive in tests.
if (typeof setInterval !== "undefined") {
  const interval: ReturnType<typeof setInterval> = setInterval(prune, 5 * 60 * 1000);
  const maybeUnref = interval as unknown as { unref?: () => void };
  if (maybeUnref.unref) maybeUnref.unref();
}
