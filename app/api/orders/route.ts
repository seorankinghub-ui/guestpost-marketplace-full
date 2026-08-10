import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const role = request.nextUrl.searchParams.get('role');
  const status = request.nextUrl.searchParams.get('status');

  let orders: any[];

  const effectiveRole = role || session.role;

  if (effectiveRole === 'publisher') {
    // Get site IDs owned by this publisher
    const siteIds = db.prepare(
      'SELECT site_id FROM publisher_sites WHERE user_id = ?'
    ).all(session.id) as any[];
    const mySiteIds = siteIds.map((s: any) => s.site_id);

    if (mySiteIds.length === 0) return NextResponse.json({ orders: [] });

    const statusCondition = status ? "AND o.status = ?" : "";
    const query = `
      SELECT o.*, s.domain as site_domain, u.name as buyer_name
      FROM orders o
      JOIN sites s ON o.site_id = s.id
      JOIN users u ON o.buyer_id = u.id
      WHERE o.site_id IN (${mySiteIds.map(() => '?').join(',')}) ${statusCondition}
      ORDER BY o.created_at DESC
    `;
    const params = [...mySiteIds, ...(status ? [status] : [])];
    orders = db.prepare(query).all(...params) as any[];
  } else if (session.role === 'buyer') {
    const statusCondition = status ? "AND status = ?" : "";
    const params = [session.id, ...(status ? [status] : [])];
    orders = db.prepare(`
      SELECT o.*, s.domain as site_domain, u.name as publisher_name
      FROM orders o
      JOIN sites s ON o.site_id = s.id
      LEFT JOIN users u ON o.publisher_id = u.id
      WHERE o.buyer_id = ? ${statusCondition}
      ORDER BY o.created_at DESC
    `).all(...params) as any[];
  } else {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  return NextResponse.json({ orders });
}
