export const dynamic = 'force-dynamic';

// @ts-nocheck
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

const S = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 4 },
  pageSub: { fontSize: 14, color: '#718096', marginBottom: 28 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
  statCard: { backgroundColor: '#fff', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0' },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 700, color: '#1a202c' },
  statLabel: { fontSize: 13, color: '#718096', marginTop: 4 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: '#2d3748', marginBottom: 14 },
  table: { width: '100%', borderCollapse: 'collapse' as const, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' },
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f7fafc' },
  td: { padding: '12px 16px', fontSize: 13, color: '#4a5568', borderBottom: '1px solid #edf2f7' },
  badge: (color: string) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: `${color}20`,
    color,
  }),
  quickActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  quickActions: { display: 'flex', gap: 12, marginBottom: 28 },
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

export default async function PublisherDashboard() {
  const token = cookies().get('session_token')?.value;
  if (!token) redirect('/login');

  const session = getSession(token);
  if (!session || session.role !== 'publisher') redirect('/login');

  const db = getDb();

  const siteIds = db.prepare(
    'SELECT site_id FROM publisher_sites WHERE user_id = ?'
  ).all(session.id) as any[];
  const mySiteIds = siteIds.map((s: any) => s.site_id);

  const activeSiteCount = mySiteIds.length > 0
    ? (db.prepare(
        `SELECT COUNT(*) as count FROM sites WHERE id IN (${mySiteIds.map(() => '?').join(',')}) AND status = 'approved'`
      ).all(...mySiteIds) as any[])[0].count
    : 0;

  const pendingOrders = mySiteIds.length > 0
    ? (db.prepare(
        `SELECT COUNT(*) as count FROM orders WHERE site_id IN (${mySiteIds.map(() => '?').join(',')}) AND status = 'acceptance'`
      ).all(...mySiteIds) as any[])[0].count
    : 0;

  const completedOrders = mySiteIds.length > 0
    ? (db.prepare(
        `SELECT COUNT(*) as count FROM orders WHERE site_id IN (${mySiteIds.map(() => '?').join(',')}) AND status = 'completed'`
      ).all(...mySiteIds) as any[])[0].count
    : 0;

  const totalEarned = mySiteIds.length > 0
    ? (db.prepare(
        `SELECT COALESCE(SUM(price), 0) as total FROM orders WHERE site_id IN (${mySiteIds.map(() => '?').join(',')}) AND status = 'completed'`
      ).all(...mySiteIds) as any[])[0].total
    : 0;

  const recentOrders = mySiteIds.length > 0
    ? db.prepare(`
        SELECT o.*, s.domain as site_domain, u.name as buyer_name
        FROM orders o
        JOIN sites s ON o.site_id = s.id
        JOIN users u ON o.buyer_id = u.id
        WHERE o.site_id IN (${mySiteIds.map(() => '?').join(',')})
        ORDER BY o.created_at DESC
        LIMIT 5
      `).all(...mySiteIds)
    : [];

  return (
    <div>
      <h1 style={S.pageTitle}>Welcome back, {session.name.split(' ')[0]}</h1>
      <p style={S.pageSub}>Here&apos;s what&apos;s happening with your sites and orders.</p>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <div style={S.statIcon}>🌐</div>
          <div style={S.statValue}>{activeSiteCount}</div>
          <div style={S.statLabel}>Active Sites</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statIcon}>📥</div>
          <div style={S.statValue}>{pendingOrders}</div>
          <div style={S.statLabel}>Pending Orders</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statIcon}>✅</div>
          <div style={S.statValue}>{completedOrders}</div>
          <div style={S.statLabel}>Completed Orders</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statIcon}>💵</div>
          <div style={S.statValue}>${Number(totalEarned).toFixed(2)}</div>
          <div style={S.statLabel}>Total Earned</div>
        </div>
      </div>

      <div style={S.quickActions}>
        <a href="/sites/add" style={{ ...S.quickActionBtn, backgroundColor: '#3182ce', color: '#fff' }}>
          ➕ Add Site
        </a>
        <a href="/orders" style={{ ...S.quickActionBtn, backgroundColor: '#edf2f7', color: '#4a5568' }}>
          📋 View Orders
        </a>
      </div>

      <div style={S.section}>
        <h2 style={S.sectionTitle}>Recent Orders</h2>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Buyer</th>
              <th style={S.th}>Site</th>
              <th style={S.th}>Type</th>
              <th style={S.th}>Price</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {(recentOrders as any[]).map((order: any) => (
              <tr key={order.id}>
                <td style={S.td}>{order.buyer_name}</td>
                <td style={S.td}>{order.site_domain}</td>
                <td style={S.td}>{order.product_type.replace(/_/g, ' ')}</td>
                <td style={{ ...S.td, fontWeight: 600 }}>${Number(order.price).toFixed(2)}</td>
                <td style={S.td}>
                  <span style={S.badge(statusColors[order.status] || '#718096')}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={S.td}>{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              </tr>
            ))}
            {(recentOrders as any[]).length === 0 && (
              <tr>
                <td style={{ ...S.td, textAlign: 'center', color: '#a0aec0' }} colSpan={6}>
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
