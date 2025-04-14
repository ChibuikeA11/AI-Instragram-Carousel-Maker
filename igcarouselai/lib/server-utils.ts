'use server';

import * as crypto from 'crypto';
import { ApiErrors } from './api-errors';

async function scryptAsync(
  password: string,
  salt: string,
  keylen: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

interface PasswordHash {
  hash: string;
  salt: string;
}

export async function hashPassword(password: string): Promise<PasswordHash> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return {
    hash: hash.toString('hex'),
    salt
  };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const hash = (await scryptAsync(password, storedSalt, 64)) as Buffer;
  const hashBuffer = Buffer.from(storedHash, 'hex');
  return crypto.timingSafeEqual(hash, hashBuffer);
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function createPasswordResetToken(): { token: string; expiresAt: Date } {
  const token = generateResetToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

  return { token, expiresAt };
}

export function validatePasswordResetToken(token: string, expiresAt: Date): void {
  if (new Date() > expiresAt) {
    throw ApiErrors.ValidationError('Password reset token has expired');
  }

  if (token.length !== 64) {
    throw ApiErrors.ValidationError('Invalid password reset token');
  }
}

export function maskEmailAddress(email: string): string {
  const [localPart, domain] = email.split('@');
  const maskedLocal = `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
  const [domainName, tld] = domain.split('.');
  const maskedDomain = `${domainName[0]}${'*'.repeat(domainName.length - 1)}.${tld}`;
  return `${maskedLocal}@${maskedDomain}`;
}