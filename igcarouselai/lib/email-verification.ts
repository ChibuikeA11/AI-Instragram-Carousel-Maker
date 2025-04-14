import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';
import { ApiErrors } from './api-errors';
import { sendEmail } from './email';
import config from './config';

const redis = Redis.fromEnv();

const VERIFICATION_EXPIRY = 24 * 60 * 60; // 24 hours
const VERIFICATION_PREFIX = 'verify:';

export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

export async function createEmailVerification(email: string): Promise<string> {
  const token = generateVerificationToken();
  const key = `${VERIFICATION_PREFIX}${token}`;
  
  await redis.set(key, email, {
    ex: VERIFICATION_EXPIRY
  });

  return token;
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${config.app.url}/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Verify Your Email Address</h1>
        
        <p>Hello,</p>
        
        <p>Please click the button below to verify your email address:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>This link will expire in 24 hours. If you didn't request this verification, you can safely ignore this email.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          If the button above doesn't work, copy and paste this URL into your browser:<br>
          <span style="color: #4F46E5;">${verificationUrl}</span>
        </p>
      </div>
    `
  });
}

export async function verifyEmailToken(token: string): Promise<string> {
  const key = `${VERIFICATION_PREFIX}${token}`;
  const email = await redis.get<string>(key);

  if (!email) {
    throw ApiErrors.ValidationError('Invalid or expired verification token');
  }

  // Delete the token after successful verification
  await redis.del(key);

  return email;
}

export async function isEmailVerified(email: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db('next-app');

  const user = await db.collection('users').findOne({ email });
  return user?.emailVerified === true;
}

export async function markEmailAsVerified(email: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db('next-app');

  await db.collection('users').updateOne(
    { email },
    { 
      $set: { 
        emailVerified: true,
        updatedAt: new Date()
      } 
    }
  );
}