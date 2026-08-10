import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const db = getDb();
  const order = db.prepare(`
    SELECT o.*,
           ub.name as buyer_name, ub.email as buyer_email,
           up.name as publisher_name, up.email as publisher_email,
           s.domain as site_domain
    FROM orders o
    JOIN users ub ON o.buyer_id = ub.id
    LEFT JOIN users up ON o.publisher_id = up.id
    LEFT JOIN sites s ON o.site_id = s.id
    WHERE o.id = ?
  `).get(params.id) as any;

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  return NextResponse.json({ order });
}
