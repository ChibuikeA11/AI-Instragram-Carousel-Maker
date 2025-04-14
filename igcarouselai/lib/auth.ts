import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { env } from './env';

export interface AuthUser {
  email: string;
  hasPaid: boolean;
}

export async function getCurrentUser(request?: NextRequest): Promise<AuthUser | null> {
  const token = request?.headers.get('authorization')?.split(' ')[1] || 
                cookies().get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function createAuthToken(user: { email: string; hasPaid: boolean }) {
  return jwt.sign(
    { email: user.email, hasPaid: user.hasPaid },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}