export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default async function BuyerDashboardPage() {
  const token = cookies().get('session_token')?.value;
  const user = token ? getSession(token) : null;
  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please log in</div>;

  const db = getDb();

  // Stats
  const activeOrders = db.prepare(
    `SELECT COUNT(*) as count FROM orders WHERE buyer_id = ? AND status IN ('task_review','acceptance','in_progress','approval','improvement')`
  ).get(user.id) as any;
  const completedOrders = db.prepare(
    `SELECT COUNT(*) as count FROM orders WHERE buyer_id = ? AND status = 'completed'`
  ).get(user.id) as any;
  const totalSpent = db.prepare(
    `SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE buyer_id = ? AND status != 'draft' AND status != 'rejected'`
  ).get(user.id) as any;

  const latestUser = db.prepare('SELECT balance_main FROM users WHERE id = ?').get(user.id) as any;
  const balance = latestUser?.balance_main ?? user.balance_main;

  // Recent orders
  const recentOrders = db.prepare(`
    SELECT o.*, s.domain as site_domain
    FROM orders o JOIN sites s ON o.site_id = s.id
    WHERE o.buyer_id = ?
    ORDER BY o.created_at DESC LIMIT 5
  `).all(user.id) as any[];

  const statusColors: Record<string, string> = {
    draft: '#94a3b8', task_review: '#3b82f6', acceptance: '#eab308',
    in_progress: '#f97316', approval: '#8b5cf6', improvement: '#ec4899',
    completed: '#10b981', rejected: '#ef4444'
  };

  const formatDate = (d: string) => new Date(d + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const stats = [
    { label: 'Active Orders', value: activeOrders.count, color: '#3b82f6', icon: '📋' },
    { label: 'Completed', value: completedOrders.count, color: '#10b981', icon: '✅' },
    { label: 'Total Spent', value: `$${totalSpent.total.toFixed(2)}`, color: '#f59e0b', icon: '💳' },
    { label: 'Balance', value: `$${balance.toFixed(2)}`, color: '#8b5cf6', icon: '💰' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>
        Welcome back, {user.name.split(' ')[0]}!
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Here&apos;s what&apos;s happening with your guest post orders.
      </p>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link href="/catalog" style={{
          background: '#2563eb', color: 'white', padding: '.6rem 1.25rem',
          borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '.9rem'
        }}>
          🔍 Browse Sites
        </Link>
        <Link href="/orders" style={{
          background: '#f1f5f9', color: '#334155', padding: '.6rem 1.25rem',
          borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '.9rem'
        }}>
          📋 View Orders
        </Link>
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Orders</h2>
          <Link href="/orders" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '.85rem', fontWeight: 500 }}>View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div style={{ padding: '3rem 1.25rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>📭</div>
            <p style={{ fontSize: '.9rem' }}>No orders yet. Start browsing sites to place your first order!</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Site</th>
                <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Price</th>
                <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: any) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 500 }}>
                    <Link href={`/orders/${order.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                      {order.site_domain}
                    </Link>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{order.product_type.replace(/_/g, ' ')}</div>
                  </td>
                  <td style={{ padding: '.75rem 1rem' }}>
                    <span style={{
                      display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12,
                      background: (statusColors[order.status] || '#94a3b8') + '20',
                      color: statusColors[order.status] || '#94a3b8',
                      fontSize: '.75rem', fontWeight: 600
                    }}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '.75rem 1rem', fontWeight: 600 }}>${order.price.toFixed(2)}</td>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
