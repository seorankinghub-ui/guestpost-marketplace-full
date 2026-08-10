import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const db = getDb();
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(params.id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await request.json();

  if (body.role) {
    db.prepare("UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?")
      .run(body.role, params.id);
    return NextResponse.json({ message: 'Role updated' });
  }

  if (body.status === 'suspended') {
    db.prepare("UPDATE users SET role = 'buyer', updated_at = datetime('now') WHERE id = ?")
      .run(params.id);
    return NextResponse.json({ message: 'User suspended' });
  }

  return NextResponse.json({ error: 'No valid update' }, { status: 400 });
}
