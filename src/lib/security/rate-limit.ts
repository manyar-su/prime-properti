type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

type HitRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, HitRecord>();

function now() {
  return Date.now();
}

export function applyRateLimit(key: string, config: RateLimitConfig) {
  const ts = now();
  const current = store.get(key);

  if (!current || current.resetAt <= ts) {
    const resetAt = ts + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.limit - 1, resetAt };
  }

  if (current.count >= config.limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  store.set(key, current);
  return { allowed: true, remaining: config.limit - current.count, resetAt: current.resetAt };
}

export const RATE_LIMITS = {
  global: { limit: 100, windowMs: 60_000 },
  auth: { limit: 10, windowMs: 60_000 },
  contact: { limit: 3, windowMs: 3_600_000 },
};

