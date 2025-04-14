import { Redis } from '@upstash/redis';
import config from './config';
import { ApiErrors } from './api-errors';
import type { User } from '@/types/api';

const redis = Redis.fromEnv();

const SESSION_PREFIX = 'session:';
const SESSION_EXPIRY = 3600; // 1 hour

interface SessionData {
  user: User;
  createdAt: number;
  lastActive: number;
}

export async function createSession(user: User): Promise<string> {
  const sessionId = crypto.randomUUID();
  const sessionKey = `${SESSION_PREFIX}${sessionId}`;
  
  const sessionData: SessionData = {
    user,
    createdAt: Date.now(),
    lastActive: Date.now(),
  };

  await redis.set(sessionKey, JSON.stringify(sessionData), {
    ex: SESSION_EXPIRY
  });

  return sessionId;
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  const sessionKey = `${SESSION_PREFIX}${sessionId}`;
  const data = await redis.get<string>(sessionKey);
  
  if (!data) return null;
  
  const session = JSON.parse(data) as SessionData;
  
  // Update last active timestamp
  session.lastActive = Date.now();
  await redis.set(sessionKey, JSON.stringify(session), {
    ex: SESSION_EXPIRY // Reset expiry
  });

  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessionKey = `${SESSION_PREFIX}${sessionId}`;
  await redis.del(sessionKey);
}

export async function getAllUserSessions(email: string): Promise<string[]> {
  const sessions = await redis.keys(`${SESSION_PREFIX}*`);
  const activeSessions: string[] = [];

  for (const sessionKey of sessions) {
    const data = await redis.get<string>(sessionKey);
    if (data) {
      const session = JSON.parse(data) as SessionData;
      if (session.user.email === email) {
        activeSessions.push(sessionKey.replace(SESSION_PREFIX, ''));
      }
    }
  }

  return activeSessions;
}

export async function invalidateAllUserSessions(email: string): Promise<void> {
  const sessions = await getAllUserSessions(email);
  
  for (const sessionId of sessions) {
    await deleteSession(sessionId);
  }
}

export async function validateSession(sessionId: string): Promise<User> {
  const session = await getSession(sessionId);
  
  if (!session) {
    throw ApiErrors.Unauthorized;
  }

  return session.user;
}