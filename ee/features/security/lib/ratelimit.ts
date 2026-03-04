import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/lib/redis";

const noopLimiter = {
  limit: async (_key: string) => ({
    success: true,
    limit: 0,
    remaining: 0,
    reset: 0,
  }),
} as unknown as Ratelimit;

/**
 * Simple rate limiters for core endpoints
 */
export const rateLimiters = {
  // 3 auth attempts per hour per IP
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "20 m"),
        prefix: "rl:auth",
        enableProtection: true,
        analytics: true,
      })
    : noopLimiter,

  // 5 billing operations per hour per IP
  billing: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "20 m"),
        prefix: "rl:billing",
        enableProtection: true,
        analytics: true,
      })
    : noopLimiter,
};

/**
 * Apply rate limiting with error handling
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
): Promise<{ success: boolean; remaining?: number; error?: string }> {
  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
    };
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Fail open - allow request if rate limiting fails
    return { success: true, error: "Rate limiting unavailable" };
  }
}
