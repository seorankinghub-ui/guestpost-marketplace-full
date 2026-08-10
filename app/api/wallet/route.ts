import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const type = request.nextUrl.searchParams.get('type');

  if (!type) {
    // Default: return wallet balances for current user
    const user = db.prepare('SELECT balance_main, balance_reserved, balance_bonus FROM users WHERE id = ?').get(session.id) as any;
    const transactions = db.prepare('SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(session.id) as any[];
    return NextResponse.json({
      balances: {
        main: user?.balance_main || 0,
        reserved: user?.balance_reserved || 0,
        bonus: user?.balance_bonus || 0,
      },
      transactions,
    });
  }

  if (type === 'earnings') {
    const siteIds = db.prepare('SELECT site_id FROM publisher_sites WHERE user_id = ?')
      .all(session.id) as any[];
    const mySiteIds = siteIds.map((s: any) => s.site_id);

    let totalEarned = 0;
    if (mySiteIds.length > 0) {
      const earned = db.prepare(`
        SELECT COALESCE(SUM(price), 0) as total FROM orders
        WHERE site_id IN (${mySiteIds.map(() => '?').join(',')}) AND status = 'completed'
      `).get(...mySiteIds) as any;
      totalEarned = earned.total;
    }

    const released = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM wallet_transactions
      WHERE user_id = ? AND type = 'release' AND balance_type = 'main'
    `).get(session.id) as any;

    const payouts = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM wallet_transactions
      WHERE user_id = ? AND type = 'payout'
    `).get(session.id) as any;

    const available = (released.total || 0) - (payouts.total || 0);

    // Next payout: 5th or 20th
    const now = new Date();
    const day = now.getDate();
    let nextDate;
    if (day < 5) nextDate = new Date(now.getFullYear(), now.getMonth(), 5);
    else if (day < 20) nextDate = new Date(now.getFullYear(), now.getMonth(), 20);
    else nextDate = new Date(now.getFullYear(), now.getMonth() + 1, 5);

    return NextResponse.json({
      totalEarned,
      available: Math.max(0, available),
      nextPayout: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
  }

  if (type === 'transactions') {
    const transactions = db.prepare(`
      SELECT * FROM wallet_transactions
      WHERE user_id = ? AND type IN ('release', 'payout')
      ORDER BY created_at DESC
      LIMIT 50
    `).all(session.id) as any[];
    return NextResponse.json({ transactions });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  if (body.action === 'withdraw') {
    const db = getDb();
    const released = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM wallet_transactions
      WHERE user_id = ? AND type = 'release' AND balance_type = 'main'
    `).get(session.id) as any;
    const payouts = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM wallet_transactions
      WHERE user_id = ? AND type = 'payout'
    `).get(session.id) as any;
    const available = (released.total || 0) - (payouts.total || 0);

    if (available <= 0) {
      return NextResponse.json({ error: 'No funds available for withdrawal' }, { status: 400 });
    }

    db.prepare(`
      INSERT INTO wallet_transactions (user_id, type, amount, balance_type, description)
      VALUES (?, 'payout', ?, 'main', 'Withdrawal requested')
    `).run(session.id, available);

    return NextResponse.json({
      message: `Withdrawal of $${available.toFixed(2)} requested. Funds will be sent to your payment method.`,
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
