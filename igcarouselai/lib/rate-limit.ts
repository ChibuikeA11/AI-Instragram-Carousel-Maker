import { Redis } from '@upstash/redis';
import config from './config';
import { ApiErrors } from './api-errors';

const redis = Redis.fromEnv();

interface RateLimitConfig {
  limit: number;
  window: string; // e.g., '1h', '1d', '30d'
}

const LIMITS: Record<string, RateLimitConfig> = {
  carousel_generation: {
    limit: config.premium.limits.carouselsPerMonth,
    window: '30d',
  },
  api_requests: {
    limit: config.api.rateLimit.maxRequests,
    window: '1m',
  }
};

export async function checkRateLimit(
  userId: string,
  action: keyof typeof LIMITS
): Promise<void> {
  const { limit, window } = LIMITS[action];
  const key = `rate_limit:${action}:${userId}`;

  // Get current count
  const count = await redis.incr(key);

  // Set expiry on first request
  if (count === 1) {
    await redis.expire(key, parseWindow(window));
  }

  if (count > limit) {
    throw ApiErrors.RateLimitExceeded;
  }
}

export async function getRateLimitInfo(
  userId: string,
  action: keyof typeof LIMITS
): Promise<{ remaining: number; reset: number }> {
  const { limit, window } = LIMITS[action];
  const key = `rate_limit:${action}:${userId}`;

  const [count, ttl] = await Promise.all([
    redis.get<number>(key),
    redis.ttl(key),
  ]);

  return {
    remaining: Math.max(0, limit - (count || 0)),
    reset: Date.now() + (ttl || 0) * 1000,
  };
}

// Convert window string to seconds
function parseWindow(window: string): number {
  const value = parseInt(window);
  const unit = window.slice(-1);

  switch (unit) {
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      throw new Error(`Invalid window format: ${window}`);
  }
}