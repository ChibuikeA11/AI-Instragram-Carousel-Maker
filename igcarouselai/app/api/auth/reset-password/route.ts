import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { ApiErrors, handleApiError } from '@/lib/api-errors';
import { sanitizeEmail, createPasswordResetToken, hashPassword } from '@/lib/server-utils';
import { generatePasswordResetEmail, sendEmail } from '@/lib/email';
import { invalidateAllUserSessions } from '@/lib/session';
import clientPromise from '@/lib/mongodb';
import { z } from 'zod';

const redis = Redis.fromEnv();

const RequestSchema = z.object({
  email: z.string().email()
});

const ResetSchema = z.object({
  token: z.string(),
  password: z.string().min(8)
});

// Token expires in 1 hour
const RESET_TOKEN_EXPIRY = 3600;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = RequestSchema.safeParse(body);

    if (!validatedData.success) {
      throw ApiErrors.ValidationError(validatedData.error.message);
    }

    const email = sanitizeEmail(validatedData.data.email);
    
    const client = await clientPromise;
    const db = client.db('next-app');

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({
        message: 'If an account exists with this email, a password reset link will be sent.'
      });
    }

    const { token, expiresAt } = createPasswordResetToken();
    
    // Store reset token in Redis with expiry
    await redis.set(`reset:${token}`, email, {
      ex: RESET_TOKEN_EXPIRY
    });

    // Generate and send password reset email
    const emailOptions = generatePasswordResetEmail(email, token);
    await sendEmail(emailOptions);

    return NextResponse.json({
      message: 'Password reset instructions sent'
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ResetSchema.safeParse(body);

    if (!validatedData.success) {
      throw ApiErrors.ValidationError(validatedData.error.message);
    }

    const { token, password } = validatedData.data;

    // Get email from Redis using token
    const email = await redis.get<string>(`reset:${token}`);
    if (!email) {
      throw ApiErrors.ValidationError('Invalid or expired reset token');
    }

    const client = await clientPromise;
    const db = client.db('next-app');

    // Update password
    const { hash, salt } = await hashPassword(password);
    await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          passwordHash: hash,
          passwordSalt: salt,
          updatedAt: new Date()
        } 
      }
    );

    // Delete the used token
    await redis.del(`reset:${token}`);

    // Invalidate all existing sessions for security
    await invalidateAllUserSessions(email);

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: 'Password Successfully Reset',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Password Reset Successful</h1>
          
          <p>Hello,</p>
          
          <p>Your password has been successfully reset. If you did not make this change, please contact our support team immediately.</p>
          
          <p>For security reasons, you have been logged out of all devices and will need to log in again with your new password.</p>
        </div>
      `
    });

    return NextResponse.json({
      message: 'Password successfully reset'
    });
  } catch (error) {
    return handleApiError(error);
  }
}