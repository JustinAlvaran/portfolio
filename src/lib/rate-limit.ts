import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;

const memoryBuckets = new Map<string, { count: number; reset: number }>();

let redisLimiter: Ratelimit | null = null;

function getRedisLimiter() {
  if (redisLimiter) {
    return redisLimiter;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  redisLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(LIMIT, "10 m"),
    analytics: false,
    prefix: "portfolio-chat",
  });

  return redisLimiter;
}

function memoryLimit(identifier: string): LimitResult {
  const now = Date.now();
  const bucket = memoryBuckets.get(identifier);

  if (!bucket || bucket.reset < now) {
    const reset = now + WINDOW_MS;
    memoryBuckets.set(identifier, { count: 1, reset });
    return { success: true, limit: LIMIT, remaining: LIMIT - 1, reset };
  }

  bucket.count += 1;

  return {
    success: bucket.count <= LIMIT,
    limit: LIMIT,
    remaining: Math.max(0, LIMIT - bucket.count),
    reset: bucket.reset,
  };
}

export async function limitChat(identifier: string): Promise<LimitResult> {
  const limiter = getRedisLimiter();

  if (!limiter) {
    return memoryLimit(identifier);
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
