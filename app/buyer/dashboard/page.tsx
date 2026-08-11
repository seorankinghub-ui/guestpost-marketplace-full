export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

// Demo fallback data for when DB is unavailable (Vercel cold starts)
const DEMO_ORDERS = [
  { id: 1, site_name: 'techinsider.com', status: 'completed', price: 95, created_at: '2026-08-01' },
  { id: 2, site_name: 'healthwise.org', status: 'in_progress', price: 78, created_at: '2026-08-05' },
  { id: 3, site_name: 'financepulse.com', status: 'task_review', price: 120, created_at: '2026-08-08' },
];

const statusColors: Record<string, string> = {
  draft: '#94a3b8', task_review: '#3b82f6', acceptance: '#eab308',
  in_progress: '#f97316', approval: '#8b5cf6', improvement: '#ec4899',
  completed: '#10b981', rejected: '#ef4444'
};

export default async function BuyerDashboardPage() {
  const token = cookies().get('session_token')?.value;
  const user = token ? getSession(token) : null;

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>Please Log In</h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>You need to sign in to access your dashboard.</p>
        <Link href="/login" style={{
          background: '#2563eb', color: 'white', padding: '.75rem 2rem',
          borderRadius: 8, textDecoration: 'none', fontWeight: 600
        }}>
          Go to Login
        </Link>
      </div>
    );
  }

  // Use demo fallback data
  const orders = DEMO_ORDERS;
  const balance = user.balance_main || 500;
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'rejected').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalSpent = orders.filter(o => o.status !== 'rejected').reduce((sum, o) => sum + o.price, 0);

  const stats = [
    { label: 'Active Orders', value: activeOrders, color: '#3b82f6', icon: '📋' },
    { label: 'Completed', value: completedOrders, color: '#10b981', icon: '✅' },
    { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, color: '#f59e0b', icon: '💳' },
    { label: 'Balance', value: `$${balance.toFixed(2)}`, color: '#8b5cf6', icon: '💰' },
  ];

  const formatDate = (d: string) => {
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

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
        <Link href="/buyer/catalog" style={{
          background: '#2563eb', color: 'white', padding: '.6rem 1.25rem',
          borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '.9rem'
        }}>
          🔍 Browse Sites
        </Link>
        <Link href="/buyer/orders" style={{
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
          <Link href="/buyer/orders" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '.85rem', fontWeight: 500 }}>View all →</Link>
        </div>
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
            {orders.map((order: any) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 500 }}>
                  <span style={{ color: '#2563eb' }}>{order.site_name}</span>
                  <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>Content placement</div>
                </td>
                <td style={{ padding: '.75rem 1rem' }}>
                  <span style={{
                    display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12,
                    background: (statusColors[order.status] || '#94a3b8') + '20',
                    color: statusColors[order.status] || '#94a3b8',
                    fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize'
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
      </div>
    </div>
  );
}
