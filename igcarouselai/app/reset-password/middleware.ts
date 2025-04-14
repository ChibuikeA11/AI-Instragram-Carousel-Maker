import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function middleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.next();
  }

  // Check if token exists in Redis
  const email = await redis.get<string>(`reset:${token}`);
  if (!email) {
    // Token is invalid or expired, redirect to the request page
    const url = new URL('/reset-password', request.url);
    url.searchParams.delete('token');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}