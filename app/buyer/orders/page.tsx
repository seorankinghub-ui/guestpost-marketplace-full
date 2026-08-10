import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import OrderCard from '@/components/OrderCard';

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function OrdersPage({ searchParams }: Props) {
  const token = cookies().get('session_token')?.value;
  const user = token ? getSession(token) : null;
  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please log in</div>;

  const db = getDb();
  const status = searchParams.status || 'all';
  const page = parseInt(searchParams.page || '1');
  const limit = 15;
  const offset = (page - 1) * limit;

  let where = 'WHERE o.buyer_id = ?';
  const params: any[] = [user.id];
  if (status !== 'all') {
    where += ' AND o.status = ?';
    params.push(status);
  }

  const orders = db.prepare(`
    SELECT o.*, s.domain as site_domain, s.url as site_url
    FROM orders o JOIN sites s ON o.site_id = s.id
    ${where}
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as any[];

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM orders o ${where}`).get(...params) as any;
  const total = countRow.total;
  const totalPages = Math.ceil(total / limit);

  const tabs = [
    { key: 'all', label: 'All', count: null },
    { key: 'draft', label: 'Draft', count: null },
    { key: 'task_review', label: 'In Review', count: null },
    { key: 'acceptance', label: 'Accepted', count: null },
    { key: 'in_progress', label: 'In Progress', count: null },
    { key: 'approval', label: 'Pending Approval', count: null },
    { key: 'completed', label: 'Completed', count: null },
    { key: 'rejected', label: 'Rejected', count: null },
  ];

  // Get counts for each tab
  for (const tab of tabs) {
    if (tab.key === 'all') {
      const r = db.prepare('SELECT COUNT(*) as c FROM orders WHERE buyer_id = ?').get(user.id) as any;
      tab.count = r.c;
    } else {
      const r = db.prepare('SELECT COUNT(*) as c FROM orders WHERE buyer_id = ? AND status = ?').get(user.id, tab.key) as any;
      tab.count = r.c;
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>My Orders</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Track and manage all your guest post orders.
      </p>

      {/* Status Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.25rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <a key={tab.key} href={`/orders?status=${tab.key}`} style={{
            padding: '.5rem .9rem', borderRadius: 6, fontSize: '.8rem', fontWeight: 500,
            textDecoration: 'none',
            background: status === tab.key ? '#2563eb' : '#f1f5f9',
            color: status === tab.key ? 'white' : '#475569',
            whiteSpace: 'nowrap'
          }}>
            {tab.label} {tab.count !== null && <span style={{ opacity: .7 }}>({tab.count})</span>}
          </a>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '.5rem', color: '#64748b' }}>No orders found</h3>
          <p>Start by browsing sites and placing an order.</p>
          <a href="/catalog" style={{ display: 'inline-block', marginTop: '1rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
            Browse Sites →
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {orders.map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1.5rem' }}>
          {page > 1 && (
            <a href={`/orders?status=${status}&page=${page - 1}`} style={{
              padding: '.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 6,
              color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '.85rem'
            }}>← Previous</a>
          )}
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const startPage = Math.max(1, Math.min(page - 4, totalPages - 9));
            const p = startPage + i;
            if (p > totalPages) return null;
            return (
              <a key={p} href={`/orders?status=${status}&page=${p}`} style={{
                padding: '.5rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6,
                color: p === page ? 'white' : '#2563eb', background: p === page ? '#2563eb' : 'white',
                textDecoration: 'none', fontWeight: 500, fontSize: '.85rem', minWidth: 36, textAlign: 'center'
              }}>{p}</a>
            );
          })}
          {page < totalPages && (
            <a href={`/orders?status=${status}&page=${page + 1}`} style={{
              padding: '.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 6,
              color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '.85rem'
            }}>Next →</a>
          )}
        </div>
      )}
    </div>
  );
}
