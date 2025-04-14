import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApiErrors } from './api-errors';

const redis = Redis.fromEnv();

const SECURITY_LIMITS = {
  passwordReset: {
    points: 3,        // Number of attempts allowed
    duration: 3600,   // Duration in seconds (1 hour)
  },
  emailChange: {
    points: 2,
    duration: 3600,
  },
  accountDeletion: {
    points: 2,
    duration: 86400,  // 24 hours
  }
} as const;

type SecurityAction = keyof typeof SECURITY_LIMITS;

interface RateLimitContext {
  ip: string;
  action: SecurityAction;
  identifier?: string; // Optional user identifier
}

export async function checkSecurityRateLimit(
  context: RateLimitContext
): Promise<void> {
  const { ip, action, identifier } = context;
  const { points, duration } = SECURITY_LIMITS[action];

  // Create composite key including IP and identifier if available
  const key = `security:${action}:${ip}${identifier ? `:${identifier}` : ''}`;

  // Get current count and TTL
  const [count, ttl] = await Promise.all([
    redis.incr(key),
    redis.ttl(key),
  ]);

  // Set expiry on first request
  if (count === 1) {
    await redis.expire(key, duration);
  }

  if (count > points) {
    const remainingTime = ttl > 0 ? ttl : duration;
    throw new ApiErrors.ValidationError(
      `Too many attempts. Please try again in ${Math.ceil(remainingTime / 60)} minutes.`
    );
  }
}

export async function resetSecurityRateLimit(
  context: RateLimitContext
): Promise<void> {
  const { ip, action, identifier } = context;
  const key = `security:${action}:${ip}${identifier ? `:${identifier}` : ''}`;
  await redis.del(key);
}

export function createSecurityRateLimitMiddleware(action: SecurityAction) {
  return async function middleware(request: NextRequest) {
    try {
      await checkSecurityRateLimit({
        ip: request.ip || 'unknown',
        action,
        identifier: request.headers.get('x-user-email') || undefined,
      });
      
      return NextResponse.next();
    } catch (error) {
      if (error instanceof ApiErrors.ValidationError) {
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        );
      }
      throw error;
    }
  };
}