import { Redis } from '@upstash/redis';
import { ApiErrors } from './api-errors';
import config from './config';
import { invalidateAllUserSessions } from './session';

const redis = Redis.fromEnv();

interface SessionActivity {
  timestamp: number;
  ip: string;
  userAgent: string;
  path: string;
}

const ACTIVITY_PREFIX = 'activity:';
const SUSPICIOUS_THRESHOLD = 10; // Number of concurrent sessions that triggers warning
const MAX_ACTIVITY_ENTRIES = 100;

export async function recordSessionActivity(
  sessionId: string,
  email: string,
  activity: SessionActivity
): Promise<void> {
  const activityKey = `${ACTIVITY_PREFIX}${sessionId}`;
  
  // Store activity with TTL matching session
  await redis.lpush(activityKey, JSON.stringify(activity));
  await redis.ltrim(activityKey, 0, MAX_ACTIVITY_ENTRIES - 1);
  await redis.expire(activityKey, config.auth.cookieOptions.maxAge);

  // Check for suspicious activity
  const activeSessions = await redis.keys(`${ACTIVITY_PREFIX}*`);
  const userSessions = await Promise.all(
    activeSessions.map(async (key) => {
      const lastActivity = await redis.lindex(key, 0);
      if (!lastActivity) return null;
      
      const activity = JSON.parse(lastActivity) as SessionActivity;
      return {
        sessionId: key.replace(ACTIVITY_PREFIX, ''),
        activity
      };
    })
  );

  const uniqueIPs = new Set(
    userSessions
      .filter(Boolean)
      .map(session => session!.activity.ip)
  );

  if (uniqueIPs.size >= SUSPICIOUS_THRESHOLD) {
    // Suspicious activity detected - invalidate all sessions
    await invalidateAllUserSessions(email);
    throw ApiErrors.Unauthorized;
  }
}

export async function getSessionActivity(
  sessionId: string
): Promise<SessionActivity[]> {
  const activityKey = `${ACTIVITY_PREFIX}${sessionId}`;
  const activities = await redis.lrange(activityKey, 0, -1);
  
  return activities.map(activity => JSON.parse(activity));
}

export async function cleanupOldActivity(): Promise<void> {
  const activities = await redis.keys(`${ACTIVITY_PREFIX}*`);
  
  for (const activityKey of activities) {
    const ttl = await redis.ttl(activityKey);
    if (ttl <= 0) {
      await redis.del(activityKey);
    }
  }
}