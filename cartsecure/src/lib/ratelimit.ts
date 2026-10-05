import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const authLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "rl:auth",
  analytics: false,
});

export const apiLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  prefix: "rl:api",
  analytics: false,
});

export const aiLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  prefix: "rl:ai",
  analytics: false,
});

/**
 * Safe wrapper — if Redis isn't configured, allow the request.
 * This prevents the demo from breaking if Upstash is missing.
 */
export async function safeLimit(
  limiter: Ratelimit,
  key: string
): Promise<{ success: boolean; remaining: number }> {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return { success: true, remaining: 999 };
  }
  try {
    const res = await limiter.limit(key);
    return { success: res.success, remaining: res.remaining };
  } catch {
    return { success: true, remaining: 999 };
  }
}