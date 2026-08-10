import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const db = getDb();
  const users = db.prepare(`
    SELECT id, name, email, role, balance_main, created_at
    FROM users ORDER BY created_at DESC
  `).all() as any[];

  return NextResponse.json({ users });
}
