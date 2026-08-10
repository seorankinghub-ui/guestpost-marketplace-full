import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const order = db.prepare(`
    SELECT o.*, s.domain as site_domain,
           ub.name as buyer_name, ub.email as buyer_email,
           up.name as publisher_name
    FROM orders o
    JOIN sites s ON o.site_id = s.id
    JOIN users ub ON o.buyer_id = ub.id
    LEFT JOIN users up ON o.publisher_id = up.id
    WHERE o.id = ?
  `).get(params.id) as any;

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  // Verify access
  if (session.role === 'publisher') {
    const siteIds = db.prepare(
      'SELECT site_id FROM publisher_sites WHERE user_id = ?'
    ).all(session.id) as any[];
    const mySiteIds = siteIds.map((s: any) => s.site_id);
    if (!mySiteIds.includes(order.site_id)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
  } else if (session.role === 'buyer' && order.buyer_id !== session.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(params.id) as any;
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const body = await request.json();
  const { action } = body;

  if (session.role === 'publisher') {
    // Verify this publisher owns the site
    const ownership = db.prepare(
      'SELECT id FROM publisher_sites WHERE user_id = ? AND site_id = ?'
    ).get(session.id, order.site_id);
    if (!ownership) return NextResponse.json({ error: 'Not your site' }, { status: 403 });

    if (action === 'accept' && order.status === 'acceptance') {
      db.prepare("UPDATE orders SET status = 'in_progress', publisher_id = ?, updated_at = datetime('now') WHERE id = ?")
        .run(session.id, params.id);

      // Move funds: buyer balance → reserve → to be released later
      // For simulation: just move from buyer's reserved to publisher tracking
      db.prepare(`
        INSERT INTO wallet_transactions (user_id, type, amount, balance_type, order_id, description)
        VALUES (?, 'reserve', ?, 'reserved', ?, ?)
      `).run(order.buyer_id, order.price, params.id, `Funds reserved for order #${params.id}`);

      db.prepare(`
        UPDATE users SET balance_reserved = balance_reserved + ? WHERE id = ?
      `).run(order.price, order.buyer_id);

      // Notify buyer
      db.prepare(`INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?,'info',?,?,?)`)
        .run(order.buyer_id, 'Order Accepted', `Your order #${params.id} has been accepted.`, params.id);

      return NextResponse.json({ message: 'Order accepted. Work can now begin.' });
    }

    if (action === 'reject' && order.status === 'acceptance') {
      db.prepare("UPDATE orders SET status = 'rejected', updated_at = datetime('now') WHERE id = ?")
        .run(params.id);

      db.prepare(`INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?,'warning',?,?,?)`)
        .run(order.buyer_id, 'Order Rejected', `Your order #${params.id} was rejected by the publisher.`, params.id);

      return NextResponse.json({ message: 'Order rejected.' });
    }

    if (action === 'complete' && order.status === 'in_progress') {
      db.prepare("UPDATE orders SET status = 'approval', updated_at = datetime('now') WHERE id = ?")
        .run(params.id);

      db.prepare(`INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?,'info',?,?,?)`)
        .run(order.buyer_id, 'Pending Approval', `Publisher marked order #${params.id} as complete. Please review.`, params.id);

      return NextResponse.json({ message: 'Order marked as complete. Buyer will review.' });
    }
  }

  return NextResponse.json({ error: 'Invalid action for current state' }, { status: 400 });
}
