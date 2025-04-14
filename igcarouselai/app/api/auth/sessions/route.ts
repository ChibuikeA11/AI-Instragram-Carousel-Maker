import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { ApiErrors, handleApiError } from '@/lib/api-errors';
import { getAllUserSessions, deleteSession } from '@/lib/session';
import { getSessionActivity } from '@/lib/session-monitor';

export async function GET() {
  try {
    const headersList = headers();
    const userEmail = headersList.get('x-user-email');
    const currentSessionId = headersList.get('x-session-id');

    if (!userEmail) {
      throw ApiErrors.Unauthorized;
    }

    const sessionIds = await getAllUserSessions(userEmail);
    const sessions = await Promise.all(
      sessionIds.map(async (sessionId) => {
        const activities = await getSessionActivity(sessionId);
        const lastActivity = activities[0];
        
        return {
          sessionId,
          isCurrentSession: sessionId === currentSessionId,
          lastActivity: lastActivity ? {
            timestamp: lastActivity.timestamp,
            ip: lastActivity.ip,
            userAgent: lastActivity.userAgent,
            path: lastActivity.path,
          } : null,
        };
      })
    );

    return NextResponse.json({ sessions });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const headersList = headers();
    const userEmail = headersList.get('x-user-email');
    const currentSessionId = headersList.get('x-session-id');

    if (!userEmail) {
      throw ApiErrors.Unauthorized;
    }

    const { sessionId } = await request.json();
    
    // Prevent terminating current session through this endpoint
    if (sessionId === currentSessionId) {
      throw ApiErrors.ValidationError('Cannot terminate current session. Use logout instead.');
    }

    await deleteSession(sessionId);

    return NextResponse.json({ 
      success: true,
      message: 'Session terminated successfully' 
    });
  } catch (error) {
    return handleApiError(error);
  }
}