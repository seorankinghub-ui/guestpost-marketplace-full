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

  let orders: any[];
  if (status) {
    orders = db.prepare(`
      SELECT o.id, o.product_type, o.price, o.status, o.created_at,
             ub.name as buyer_name, ub.email as buyer_email,
             up.name as publisher_name,
             s.domain as site_domain
      FROM orders o
      JOIN users ub ON o.buyer_id = ub.id
      LEFT JOIN users up ON o.publisher_id = up.id
      LEFT JOIN sites s ON o.site_id = s.id
      WHERE o.status = ?
      ORDER BY o.created_at DESC
    `).all(status) as any[];
  } else {
    orders = db.prepare(`
      SELECT o.id, o.product_type, o.price, o.status, o.created_at,
             ub.name as buyer_name, ub.email as buyer_email,
             up.name as publisher_name,
             s.domain as site_domain
      FROM orders o
      JOIN users ub ON o.buyer_id = ub.id
      LEFT JOIN users up ON o.publisher_id = up.id
      LEFT JOIN sites s ON o.site_id = s.id
      ORDER BY o.created_at DESC
    `).all() as any[];
  }

  return NextResponse.json({ orders });
}
