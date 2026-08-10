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
  const status = request.nextUrl.searchParams.get('status');

  let sites: any[];
  if (status) {
    sites = db.prepare(`
      SELECT s.*, u.name as owner_name FROM sites s
      LEFT JOIN publisher_sites ps ON s.id = ps.site_id AND ps.is_owner = 1
      LEFT JOIN users u ON ps.user_id = u.id
      WHERE s.status = ?
      ORDER BY s.created_at DESC
    `).all(status) as any[];
  } else {
    sites = db.prepare(`
      SELECT s.*, u.name as owner_name FROM sites s
      LEFT JOIN publisher_sites ps ON s.id = ps.site_id AND ps.is_owner = 1
      LEFT JOIN users u ON ps.user_id = u.id
      ORDER BY s.created_at DESC
    `).all() as any[];
  }

  return NextResponse.json({ sites });
}
