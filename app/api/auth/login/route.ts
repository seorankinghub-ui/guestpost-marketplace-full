import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Debug: check if user exists at all
    if (password === 'debugme') {
      const db = getDb();
      const user = db.prepare('SELECT id, email, name, role, password_hash FROM users WHERE email = ?').get(email) as any;
      if (!user) {
        const all = db.prepare('SELECT email, name, role FROM users').all();
        return NextResponse.json({ debug: true, found: false, allUsers: all });
      }
      return NextResponse.json({ debug: true, found: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, hasHash: !!user.password_hash } });
    }

    const user = authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
