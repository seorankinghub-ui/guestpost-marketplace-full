export const dynamic = 'force-dynamic';

// @ts-nocheck
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

const S = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 4 },
  pageSub: { fontSize: 14, color: '#718096', marginBottom: 28 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 },
  statCard: { backgroundColor: '#fff', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0' },
  statValue: { fontSize: 26, fontWeight: 700, color: '#1a202c' },
  statLabel: { fontSize: 12, color: '#718096', marginTop: 2 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: '#2d3748', marginBottom: 14 },
  table: { width: '100%', borderCollapse: 'collapse' as const, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' },
  th: { textAlign: 'left' as const, padding: '11px 16px', fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f7fafc' },
  td: { padding: '11px 16px', fontSize: 13, color: '#4a5568', borderBottom: '1px solid #edf2f7' },
  badge: (color: string) => ({
    display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
    backgroundColor: `${color}20`, color,
  }),
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  chartCard: { backgroundColor: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: 20 },
  barChart: { display: 'flex', alignItems: 'flex-end', gap: 12, height: 140, padding: '8px 0' },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 6 },
  bar: (h: number, color: string) => ({
    width: '100%', height: `${h}%`, backgroundColor: color, borderRadius: '4px 4px 0 0', minHeight: 2,
  }),
  barLabel: { fontSize: 10, color: '#718096', textAlign: 'center' as const },
};

const statusColors: Record<string, string> = {
  completed: '#38a169',
  in_progress: '#3182ce',
  task_review: '#d69e2e',
  acceptance: '#dd6b20',
  rejected: '#e53e3e',
  draft: '#718096',
  approval: '#805ad5',
  improvement: '#d53f8c',
};

export default async function AdminDashboard() {
  const token = cookies().get('session_token')?.value;
  if (!token) redirect('/login');

  const session = getSession(token);
  if (!session || session.role !== 'admin') redirect('/login');

  const db = getDb();

  const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
  const totalSites = (db.prepare('SELECT COUNT(*) as count FROM sites').get() as any).count;
  const pendingSites = (db.prepare("SELECT COUNT(*) as count FROM sites WHERE status = 'pending'").get() as any).count;
  const totalOrders = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as any).count;
  const totalRevenue = (db.prepare("SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE status = 'completed'").get() as any).total;
  const activeDisputes = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE status IN ('task_review', 'approval', 'improvement')").get() as any).count;

  const orderStatusCounts = db.prepare(`
    SELECT status, COUNT(*) as count FROM orders GROUP BY status ORDER BY count DESC
  `).all() as any[];
  const maxCount = Math.max(...orderStatusCounts.map((s: any) => s.count), 1);

  const recentSignups = db.prepare(`
    SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5
  `).all() as any[];

  const recentOrders = db.prepare(`
    SELECT o.id, o.product_type, o.price, o.status, o.created_at,
           ub.name as buyer_name, up.name as publisher_name, s.domain
    FROM orders o
    JOIN users ub ON o.buyer_id = ub.id
    LEFT JOIN users up ON o.publisher_id = up.id
    LEFT JOIN sites s ON o.site_id = s.id
    ORDER BY o.created_at DESC LIMIT 5
  `).all() as any[];

  return (
    <div>
      <h1 style={S.pageTitle}>Admin Dashboard</h1>
      <p style={S.pageSub}>Overview of the marketplace activity.</p>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <div style={S.statValue}>{totalUsers}</div>
          <div style={S.statLabel}>Total Users</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statValue}>{totalSites}</div>
          <div style={S.statLabel}>Total Sites</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statValue, color: '#d69e2e' }}>{pendingSites}</div>
          <div style={S.statLabel}>Pending Sites</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statValue}>{totalOrders}</div>
          <div style={S.statLabel}>Total Orders</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statValue, color: '#38a169' }}>${Number(totalRevenue).toFixed(2)}</div>
          <div style={S.statLabel}>Total Revenue</div>
        </div>
        <div style={S.statCard}>
          <div style={{ ...S.statValue, color: '#e53e3e' }}>{activeDisputes}</div>
          <div style={S.statLabel}>Active Disputes</div>
        </div>
      </div>

      <div style={S.grid2}>
        {/* Orders by Status Chart */}
        <div style={S.chartCard}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#2d3748', marginBottom: 12 }}>Orders by Status</h3>
          <div style={S.barChart}>
            {orderStatusCounts.map((s: any) => (
              <div key={s.status} style={S.barCol}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#4a5568' }}>{s.count}</div>
                <div style={S.bar((s.count / maxCount) * 100, statusColors[s.status] || '#718096')} />
                <div style={S.barLabel}>{s.status.replace(/_/g, '\n')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Signups */}
        <div style={S.chartCard}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#2d3748', marginBottom: 12 }}>Recent Signups</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <thead>
              <tr>
                <th style={{ ...S.th, fontSize: 11, padding: '8px 12px' }}>Name</th>
                <th style={{ ...S.th, fontSize: 11, padding: '8px 12px' }}>Role</th>
                <th style={{ ...S.th, fontSize: 11, padding: '8px 12px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSignups.map((u: any) => (
                <tr key={u.id}>
                  <td style={{ ...S.td, padding: '8px 12px' }}>{u.name}</td>
                  <td style={{ ...S.td, padding: '8px 12px' }}>
                    <span style={S.badge(u.role === 'admin' ? '#e53e3e' : u.role === 'publisher' ? '#3182ce' : '#38a169')}>{u.role}</span>
                  </td>
                  <td style={{ ...S.td, padding: '8px 12px' }}>{new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ ...S.section, marginTop: 28 }}>
        <h2 style={S.sectionTitle}>Recent Orders</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>ID</th>
              <th style={S.th}>Buyer</th>
              <th style={S.th}>Publisher</th>
              <th style={S.th}>Site</th>
              <th style={S.th}>Type</th>
              <th style={S.th}>Price</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o: any) => (
              <tr key={o.id}>
                <td style={S.td}>#{o.id}</td>
                <td style={S.td}>{o.buyer_name}</td>
                <td style={S.td}>{o.publisher_name || '-'}</td>
                <td style={S.td}>{o.domain || '-'}</td>
                <td style={S.td}>{o.product_type.replace(/_/g, ' ')}</td>
                <td style={{ ...S.td, fontWeight: 600 }}>${Number(o.price).toFixed(2)}</td>
                <td style={S.td}>
                  <span style={S.badge(statusColors[o.status] || '#718096')}>{o.status.replace(/_/g, ' ')}</span>
                </td>
                <td style={S.td}>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
