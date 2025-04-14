import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';
import { sendEmail } from './email';
import { ApiErrors } from './api-errors';
import config from './config';
import clientPromise from './mongodb';

const redis = Redis.fromEnv();

const RECOVERY_TOKEN_EXPIRY = 3600; // 1 hour
const RECOVERY_PREFIX = 'recovery:';
const MAX_RECOVERY_ATTEMPTS = 3;

interface RecoveryOptions {
  email: string;
  recoveryType: 'email' | 'security_questions';
  securityAnswers?: {
    question: string;
    answer: string;
  }[];
}

export async function initiateAccountRecovery(options: RecoveryOptions) {
  const { email, recoveryType } = options;

  // Check if user exists
  const client = await clientPromise;
  const db = client.db('next-app');
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    throw ApiErrors.ValidationError('No account found with this email');
  }

  const token = randomBytes(32).toString('hex');
  const key = `${RECOVERY_PREFIX}${token}`;

  // Store recovery token with attempt counter
  await redis.hset(key, {
    email,
    type: recoveryType,
    attempts: 0,
  });
  await redis.expire(key, RECOVERY_TOKEN_EXPIRY);

  if (recoveryType === 'email') {
    await sendRecoveryEmail(email, token);
  } else if (recoveryType === 'security_questions') {
    // Validate security questions if provided
    if (!options.securityAnswers || options.securityAnswers.length === 0) {
      throw ApiErrors.ValidationError('Security answers are required');
    }

    // Store hashed security answers
    await redis.hset(key, {
      answers: JSON.stringify(options.securityAnswers),
    });
  }

  return token;
}

export async function verifyRecoveryAttempt(token: string, data: any) {
  const key = `${RECOVERY_PREFIX}${token}`;
  const recovery = await redis.hgetall<{
    email: string;
    type: 'email' | 'security_questions';
    attempts: string;
    answers?: string;
  }>(key);

  if (!recovery || !recovery.email) {
    throw ApiErrors.ValidationError('Invalid or expired recovery token');
  }

  // Check attempt limit
  const attempts = parseInt(recovery.attempts || '0');
  if (attempts >= MAX_RECOVERY_ATTEMPTS) {
    await redis.del(key);
    throw ApiErrors.ValidationError('Too many recovery attempts. Please start a new recovery process.');
  }

  // Increment attempt counter
  await redis.hincrby(key, 'attempts', 1);

  if (recovery.type === 'security_questions') {
    const storedAnswers = JSON.parse(recovery.answers || '[]');
    const providedAnswers = data.securityAnswers || [];

    // Verify security answers
    const isValid = validateSecurityAnswers(storedAnswers, providedAnswers);
    if (!isValid) {
      throw ApiErrors.ValidationError('Incorrect security answers');
    }
  }

  return recovery.email;
}

function validateSecurityAnswers(stored: any[], provided: any[]): boolean {
  if (stored.length !== provided.length) return false;

  return stored.every((storedQA, index) => {
    const providedQA = provided[index];
    return (
      storedQA.question === providedQA.question &&
      storedQA.answer.toLowerCase() === providedQA.answer.toLowerCase()
    );
  });
}

async function sendRecoveryEmail(email: string, token: string) {
  const recoveryUrl = `${config.app.url}/account-recovery?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Account Recovery Request',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Account Recovery</h1>
        
        <p>Hello,</p>
        
        <p>We received a request to recover your account. Click the button below to continue the recovery process:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${recoveryUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Recover Account
          </a>
        </div>
        
        <p>If you didn't request this recovery, you can safely ignore this email. The link will expire in 1 hour.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          If the button above doesn't work, copy and paste this URL into your browser:<br>
          <span style="color: #4F46E5;">${recoveryUrl}</span>
        </p>
      </div>
    `
  });
}

export async function completeAccountRecovery(email: string, newPassword: string) {
  const client = await clientPromise;
  const db = client.db('next-app');

  // Update password and clear any recovery tokens
  const { hash, salt } = await hashPassword(newPassword);
  await db.collection('users').updateOne(
    { email },
    {
      $set: {
        passwordHash: hash,
        passwordSalt: salt,
        updatedAt: new Date(),
      }
    }
  );

  // Clear all recovery tokens for this email
  const keys = await redis.keys(`${RECOVERY_PREFIX}*`);
  for (const key of keys) {
    const data = await redis.hget<string>(key, 'email');
    if (data === email) {
      await redis.del(key);
    }
  }

  // Invalidate all existing sessions for security
  await invalidateAllUserSessions(email);
}