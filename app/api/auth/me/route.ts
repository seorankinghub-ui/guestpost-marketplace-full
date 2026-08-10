import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = getSession(token);
    if (!session) return NextResponse.json({ error: 'Session expired or invalid' }, { status: 401 });

    // Fetch full user data including payment info
    const db = getDb();
    const user = db.prepare(
      'SELECT id, email, name, role, balance_main, balance_reserved, balance_bonus, paypal_email, usdt_address, publisher_terms_accepted FROM users WHERE id = ?'
    ).get(session.id) as any;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        paypal_email: user.paypal_email,
        usdt_address: user.usdt_address,
        publisher_terms_accepted: !!user.publisher_terms_accepted,
        balances: {
          main: user.balance_main || 0,
          reserved: user.balance_reserved || 0,
          bonus: user.balance_bonus || 0,
        },
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const session = getSession(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const db = getDb();
    const updates: string[] = [];
    const values: any[] = [];

    if (body.paypal_email !== undefined) { updates.push('paypal_email = ?'); values.push(body.paypal_email); }
    if (body.usdt_address !== undefined) { updates.push('usdt_address = ?'); values.push(body.usdt_address); }
    if (body.name !== undefined) { updates.push('name = ?'); values.push(body.name); }

    if (updates.length > 0) {
      updates.push("updated_at = datetime('now')");
      values.push(session.id);
      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);
      return NextResponse.json({ message: 'Settings updated' });
    }

    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  } catch (error) {
    console.error('Me PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
