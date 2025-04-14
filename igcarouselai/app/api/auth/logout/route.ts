import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import config from '@/lib/config';
import { ApiErrors, handleApiError } from '@/lib/api-errors';
import { deleteSession } from '@/lib/session';

export async function POST() {
  try {
    // Get session ID from cookie
    const sessionId = cookies().get('session_id')?.value;
    
    if (sessionId) {
      // Delete the session from Redis
      await deleteSession(sessionId);
    }

    // Clear all auth-related cookies
    cookies().delete(config.auth.cookieName);
    cookies().delete('session_id');

    // Return success response with cleared cookies
    return NextResponse.json({ 
      success: true,
      message: 'Successfully logged out'
    }, {
      headers: {
        // Clear cookies in response headers for extra security
        'Set-Cookie': [
          `${config.auth.cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`,
          `session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
        ]
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}