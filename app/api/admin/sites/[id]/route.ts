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
  const site = db.prepare('SELECT id FROM sites WHERE id = ?').get(params.id);
  if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });

  const body = await request.json();
  const { action } = body;

  if (action === 'approve') {
    db.prepare("UPDATE sites SET status = 'approved', updated_at = datetime('now') WHERE id = ?")
      .run(params.id);
    return NextResponse.json({ message: 'Site approved' });
  }

  if (action === 'reject') {
    db.prepare("UPDATE sites SET status = 'rejected', updated_at = datetime('now') WHERE id = ?")
      .run(params.id);
    return NextResponse.json({ message: 'Site rejected' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
