import { Redis } from '@upstash/redis';
import { ApiErrors } from './api-errors';

const redis = Redis.fromEnv();

// Stricter limits for authentication attempts
const AUTH_MAX_ATTEMPTS = 5;
const AUTH_WINDOW = 15 * 60; // 15 minutes
const LOCKOUT_DURATION = 60 * 60; // 1 hour

export async function checkAuthRateLimit(identifier: string): Promise<void> {
  const attemptKey = `auth_attempts:${identifier}`;
  const lockoutKey = `auth_lockout:${identifier}`;

  // Check if user is locked out
  const isLocked = await redis.exists(lockoutKey);
  if (isLocked) {
    const ttl = await redis.ttl(lockoutKey);
    throw new ApiErrors.ValidationError(
      `Too many failed attempts. Please try again in ${Math.ceil(ttl / 60)} minutes.`
    );
  }

  // Increment attempt counter
  const attempts = await redis.incr(attemptKey);
  
  // Set expiry on first attempt
  if (attempts === 1) {
    await redis.expire(attemptKey, AUTH_WINDOW);
  }

  if (attempts > AUTH_MAX_ATTEMPTS) {
    // Lock the account
    await redis.setex(lockoutKey, LOCKOUT_DURATION, '1');
    // Reset attempts counter
    await redis.del(attemptKey);
    
    throw new ApiErrors.ValidationError(
      'Account temporarily locked due to too many failed attempts. Please try again in 1 hour.'
    );
  }
}

export async function resetAuthAttempts(identifier: string): Promise<void> {
  const attemptKey = `auth_attempts:${identifier}`;
  await redis.del(attemptKey);
}