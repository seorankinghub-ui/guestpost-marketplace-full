export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

const DEMO_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@guestpost.com', role: 'admin', created_at: '2026-07-01' },
  { id: 2, name: 'Sarah Johnson', email: 'buyer@example.com', role: 'buyer', created_at: '2026-07-02' },
  { id: 3, name: 'Digital Growth Agency', email: 'agency@example.com', role: 'buyer', created_at: '2026-07-05' },
  { id: 4, name: 'TechBrand Inc', email: 'brand@example.com', role: 'buyer', created_at: '2026-07-08' },
  { id: 5, name: 'Mike Owner', email: 'publisher@example.com', role: 'publisher', created_at: '2026-07-10' },
  { id: 6, name: 'Lisa Blogs', email: 'publisher2@example.com', role: 'publisher', created_at: '2026-07-12' },
];

const DEMO_SITES = [
  { id: 1, domain: 'techinsider.com', status: 'approved', moz_da: 72, ahrefs_dr: 68, created_at: '2026-07-05' },
  { id: 2, domain: 'healthwise.org', status: 'approved', moz_da: 65, ahrefs_dr: 60, created_at: '2026-07-06' },
  { id: 3, domain: 'financepulse.com', status: 'pending', moz_da: 58, ahrefs_dr: 54, created_at: '2026-07-08' },
];

const DEMO_ORDERS = [
  { id: 1, buyer: 'Sarah Johnson', site: 'techinsider.com', price: 95, status: 'completed', created_at: '2026-08-01' },
  { id: 2, buyer: 'Digital Growth Agency', site: 'healthwise.org', price: 92, status: 'in_progress', created_at: '2026-08-03' },
  { id: 3, buyer: 'TechBrand Inc', site: 'financepulse.com', price: 120, status: 'task_review', created_at: '2026-08-06' },
];

const statusColors: Record<string, string> = {
  completed: '#38a169', in_progress: '#3182ce', task_review: '#d69e2e',
  acceptance: '#dd6b20', rejected: '#e53e3e', draft: '#718096',
  pending: '#d69e2e', approved: '#38a169',
};

export default async function AdminDashboard() {
  const token = cookies().get('session_token')?.value;
  if (!token) redirect('/login');

  const session = getSession(token);
  if (!session || session.role !== 'admin') redirect('/login');

  const totalUsers = DEMO_USERS.length;
  const totalSites = DEMO_SITES.length;
  const totalOrders = DEMO_ORDERS.length;
  const totalRevenue = DEMO_ORDERS.filter(o => o.status !== 'rejected').reduce((s, o) => s + o.price, 0);
  const pendingSites = DEMO_SITES.filter(s => s.status === 'pending').length;

  const formatDate = (d: string) => {
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>Admin Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>Overview of the GuestPost Marketplace.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#3b82f6' }}>{totalUsers}</div>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Total Users</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>{totalSites}</div>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Total Sites</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>{totalOrders}</div>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Total Orders</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#8b5cf6' }}>${totalRevenue}</div>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Total Revenue</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f97316' }}>{pendingSites}</div>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Pending Sites</div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Users</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_USERS.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{u.email}</td>
                <td style={{ padding: '.75rem 1rem' }}>
                  <span style={{
                    display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12,
                    background: u.role === 'admin' ? '#dbeafe' : u.role === 'publisher' ? '#dcfce7' : '#f1f5f9',
                    color: u.role === 'admin' ? '#1d4ed8' : u.role === 'publisher' ? '#166534' : '#475569',
                    fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ORDERS.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 500 }}>{o.buyer}</td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', color: '#2563eb' }}>{o.site}</td>
                <td style={{ padding: '.75rem 1rem', fontWeight: 600 }}>${o.price}</td>
                <td style={{ padding: '.75rem 1rem' }}>
                  <span style={{
                    display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12,
                    background: (statusColors[o.status] || '#94a3b8') + '20',
                    color: statusColors[o.status] || '#94a3b8',
                    fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize'
                  }}>
                    {o.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{formatDate(o.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
