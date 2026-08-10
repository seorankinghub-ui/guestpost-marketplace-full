import { NextRequest, NextResponse } from 'next/server';
import { getSession, destroySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return handleLogout(request);
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}

async function handleLogout(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;
    if (token) {
      destroySession(token);
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set('session_token', '', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
