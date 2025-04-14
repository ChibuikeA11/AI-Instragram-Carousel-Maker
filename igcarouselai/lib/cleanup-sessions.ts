import { Redis } from '@upstash/redis';
import { cleanupOldActivity } from './session-monitor';
import config from './config';

const redis = Redis.fromEnv();

async function cleanupSessionBatch(keys: string[]) {
  const pipeline = redis.pipeline();
  
  for (const key of keys) {
    pipeline.ttl(key);
  }

  const ttls = await pipeline.exec();
  const expiredKeys = keys.filter((_, index) => ttls[index] <= 0);

  if (expiredKeys.length > 0) {
    await redis.del(...expiredKeys);
  }

  return expiredKeys.length;
}

export async function cleanupSessions() {
  try {
    // Clean up expired session activity logs
    await cleanupOldActivity();

    // Get all session keys
    let cursor = 0;
    let totalCleaned = 0;

    do {
      // Scan for session keys in batches
      const [nextCursor, keys] = await redis.scan(
        cursor,
        {
          match: 'session:*',
          count: config.session.cleanup.batchSize
        }
      );

      cursor = nextCursor;

      if (keys.length > 0) {
        // Process batch
        const cleaned = await cleanupSessionBatch(keys);
        totalCleaned += cleaned;
      }
    } while (cursor !== 0);

    console.log(
      `Cleaned up ${totalCleaned} expired sessions at ${new Date().toISOString()}`
    );
  } catch (error) {
    console.error('Error during session cleanup:', error);
  }
}

// Only start cleanup job if enabled in config
if (process.env.NODE_ENV === 'production' && config.session.cleanup.enabled) {
  // Start cleanup job in production
  setInterval(cleanupSessions, config.session.cleanup.interval);
  
  // Run initial cleanup on startup
  cleanupSessions();
}