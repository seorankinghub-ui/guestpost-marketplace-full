import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return { error: 'Not authenticated', status: 401 };

  const session = getSession(token);
  if (!session) return { error: 'Session expired', status: 401 };
  if (session.role !== 'admin') return { error: 'Admin access required', status: 403 };

  return { session };
}

export async function GET(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    if ('error' in admin) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const db = getDb();

    const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count || 0;
    const totalSites = (db.prepare('SELECT COUNT(*) as count FROM sites').get() as any).count || 0;
    const totalOrders = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as any).count || 0;

    const revenue = (db.prepare(
      "SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE status = 'completed'"
    ).get() as any).total || 0;

    const ordersByStatus = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
      ORDER BY count DESC
    `).all() as any[];

    const recentOrders = db.prepare(`
      SELECT 
        o.*,
        s.domain as site_domain,
        b.email as buyer_email,
        b.name as buyer_name,
        p.email as publisher_email,
        p.name as publisher_name
      FROM orders o
      JOIN sites s ON s.id = o.site_id
      JOIN users b ON b.id = o.buyer_id
      LEFT JOIN users p ON p.id = o.publisher_id
      ORDER BY o.created_at DESC
      LIMIT 10
    `).all() as any[];

    const pendingSites = (db.prepare(
      "SELECT COUNT(*) as count FROM sites WHERE status = 'pending'"
    ).get() as any).count || 0;

    const activeOrders = (db.prepare(
      "SELECT COUNT(*) as count FROM orders WHERE status NOT IN ('completed', 'rejected', 'draft')"
    ).get() as any).count || 0;

    return NextResponse.json({
      totalUsers,
      totalSites,
      totalOrders,
      totalRevenue: revenue,
      pendingSites,
      activeOrders,
      ordersByStatus,
      recentOrders,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
