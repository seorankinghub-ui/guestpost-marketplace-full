import { NextRequest, NextResponse } from 'next/server';
import { registerUser, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    const user = registerUser(email, password, name, role || 'buyer');
    if (!user) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const sessionToken = createSession(user);
    const response = NextResponse.json({
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        balances: {
          main: user.balance_main || 0,
          reserved: user.balance_reserved || 0,
          bonus: user.balance_bonus || 0,
        },
      },
    });

    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
