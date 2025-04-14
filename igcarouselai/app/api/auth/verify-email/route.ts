import { NextResponse } from 'next/server';
import { ApiErrors, handleApiError } from '@/lib/api-errors';
import { 
  verifyEmailToken, 
  markEmailAsVerified, 
  createEmailVerification, 
  sendVerificationEmail 
} from '@/lib/email-verification';
import { checkSecurityRateLimit } from '@/lib/security-rate-limit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      throw ApiErrors.ValidationError('Verification token is required');
    }

    // Rate limit verification attempts
    await checkSecurityRateLimit({
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      action: 'emailChange'
    });

    const email = await verifyEmailToken(token);
    await markEmailAsVerified(email);

    return NextResponse.json({
      message: 'Email successfully verified',
      verified: true
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      throw ApiErrors.ValidationError('Email is required');
    }

    // Rate limit verification requests
    await checkSecurityRateLimit({
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      action: 'emailChange',
      identifier: email
    });

    const token = await createEmailVerification(email);
    await sendVerificationEmail(email, token);

    return NextResponse.json({
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    return handleApiError(error);
  }
}