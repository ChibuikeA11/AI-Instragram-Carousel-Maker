import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ApiErrors, handleApiError } from '@/lib/api-errors';
import { getCurrentUser } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw ApiErrors.Unauthorized;
    }

    const client = await clientPromise;
    const db = client.db('next-app');
    
    // Get fresh user data from database
    const userData = await db.collection('users').findOne(
      { email: user.email },
      { projection: { passwordHash: 0 } }
    );

    if (!userData) {
      throw ApiErrors.NotFound;
    }

    return NextResponse.json({ user: userData });
  } catch (error) {
    return handleApiError(error);
  }
}