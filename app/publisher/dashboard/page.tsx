export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const DEMO_ORDERS = [
  { id: 1, buyer_name: 'Sarah Johnson', site_name: 'techinsider.com', type: 'content_placement', price: 95, status: 'completed', created_at: '2026-08-01' },
  { id: 2, buyer_name: 'Digital Growth Agency', site_name: 'healthwise.org', type: 'writing_placement', price: 92, status: 'in_progress', created_at: '2026-08-03' },
  { id: 3, buyer_name: 'TechBrand Inc', site_name: 'financepulse.com', type: 'link_insertion', price: 80, status: 'acceptance', created_at: '2026-08-06' },
  { id: 4, buyer_name: 'Sarah Johnson', site_name: 'bizgrowth.com', type: 'content_placement', price: 52, status: 'completed', created_at: '2026-08-08' },
];

const statusColors: Record<string, string> = {
  completed: '#38a169', in_progress: '#3182ce', task_review: '#d69e2e',
  acceptance: '#dd6b20', rejected: '#e53e3e', draft: '#718096',
  approval: '#805ad5', improvement: '#d53f8c',
};

export default async function PublisherDashboard() {
  const token = cookies().get('session_token')?.value;
  if (!token) redirect('/login');

  const session = getSession(token);
  if (!session || session.role !== 'publisher') redirect('/login');

  const orders = DEMO_ORDERS;
  const activeSiteCount = 3;
  const pendingOrders = orders.filter(o => o.status === 'acceptance' || o.status === 'task_review').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalEarned = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.price, 0);

  const formatDate = (d: string) => {
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>
        Welcome back, {session.name.split(' ')[0]}!
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Here&apos;s what&apos;s happening with your sites and orders.
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>🌐</div>
          <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 500 }}>Active Sites</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{activeSiteCount}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>📥</div>
          <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 500 }}>Pending Orders</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{pendingOrders}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>✅</div>
          <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 500 }}>Completed Orders</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{completedOrders}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>💵</div>
          <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 500 }}>Total Earned</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>${totalEarned.toFixed(2)}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link href="/publisher/sites/add" style={{
          background: '#2563eb', color: 'white', padding: '.6rem 1.25rem',
          borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '.9rem'
        }}>
          ➕ Add Site
        </Link>
        <Link href="/publisher/orders" style={{
          background: '#f1f5f9', color: '#334155', padding: '.6rem 1.25rem',
          borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '.9rem'
        }}>
          📋 View Orders
        </Link>
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Orders</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Buyer</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Site</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 500 }}>{order.buyer_name}</td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', color: '#2563eb' }}>{order.site_name}</td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b', textTransform: 'capitalize' }}>
                  {order.type.replace(/_/g, ' ')}
                </td>
                <td style={{ padding: '.75rem 1rem', fontWeight: 600 }}>${order.price.toFixed(2)}</td>
                <td style={{ padding: '.75rem 1rem' }}>
                  <span style={{
                    display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12,
                    background: (statusColors[order.status] || '#718096') + '20',
                    color: statusColors[order.status] || '#718096',
                    fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize'
                  }}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
