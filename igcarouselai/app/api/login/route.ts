import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';
import { createAuthToken } from '@/lib/auth';
import { ApiErrors, handleApiError } from '@/lib/api-errors';
import { LoginSchema } from '@/lib/validations';
import { checkAuthRateLimit, resetAuthAttempts } from '@/lib/auth-rate-limit';
import { createSession } from '@/lib/session';
import config from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = LoginSchema.safeParse(body);
    if (!validatedData.success) {
      throw ApiErrors.ValidationError(validatedData.error.message);
    }

    const { email, password } = validatedData.data;

    // Check rate limit before processing login attempt
    await checkAuthRateLimit(email);
    
    const client = await clientPromise;
    const db = client.db('next-app');

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      throw ApiErrors.InvalidCredentials;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiErrors.InvalidCredentials;
    }

    // Reset auth attempts on successful login
    await resetAuthAttempts(email);

    // Create user session
    const sessionId = await createSession({
      email: user.email,
      username: user.username,
      hasPaid: user.hasPaid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

    const token = createAuthToken({ email: user.email, hasPaid: user.hasPaid });

    // Set auth token and session ID in HTTP-only cookies
    cookies().set(config.auth.cookieName, token, config.auth.cookieOptions);
    cookies().set('session_id', sessionId, {
      ...config.auth.cookieOptions,
      maxAge: 3600 // 1 hour
    });

    return NextResponse.json({ 
      token,
      user: {
        email: user.email,
        username: user.username,
        hasPaid: user.hasPaid
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}