import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';
import { createAuthToken } from '@/lib/auth';
import { ApiErrors, handleApiError } from '@/lib/api-errors';
import { RegisterSchema } from '@/lib/validations';
import { createSession } from '@/lib/session';
import { createEmailVerification, sendVerificationEmail } from '@/lib/email-verification';
import { sanitizeEmail } from '@/lib/server-utils';
import config from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = RegisterSchema.safeParse(body);
    if (!validatedData.success) {
      throw ApiErrors.ValidationError(validatedData.error.message);
    }

    const { username, email: rawEmail, password } = validatedData.data;
    const email = sanitizeEmail(rawEmail);

    const client = await clientPromise;
    const db = client.db('next-app');

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      throw ApiErrors.ConflictError('User already exists');
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    
    const newUser = {
      username,
      email,
      passwordHash,
      hasPaid: false,
      emailVerified: false,
      createdAt: now,
      updatedAt: now
    };

    await db.collection('users').insertOne(newUser);

    // Create email verification token and send verification email
    const verificationToken = await createEmailVerification(email);
    await sendVerificationEmail(email, verificationToken);

    // Create user session
    const sessionId = await createSession({
      email: newUser.email,
      username: newUser.username,
      hasPaid: newUser.hasPaid,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    });

    const token = createAuthToken({ email, hasPaid: false });

    // Set auth token and session ID in HTTP-only cookies
    cookies().set(config.auth.cookieName, token, config.auth.cookieOptions);
    cookies().set('session_id', sessionId, {
      ...config.auth.cookieOptions,
      maxAge: 3600 // 1 hour
    });

    return NextResponse.json({ 
      message: 'User registered successfully. Please check your email to verify your account.',
      token,
      user: {
        email,
        username,
        hasPaid: false,
        emailVerified: false
      }
    }, { 
      status: 201 
    });
  } catch (error) {
    return handleApiError(error);
  }
}