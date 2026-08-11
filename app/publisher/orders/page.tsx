export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const DEMO_ORDERS = [
  { id: 1, buyer: 'Sarah Johnson', site: 'techinsider.com', type: 'content_placement', price: 95, status: 'completed', created_at: '2026-08-01' },
  { id: 2, buyer: 'Digital Growth Agency', site: 'healthwise.org', type: 'writing_placement', price: 92, status: 'in_progress', created_at: '2026-08-03' },
  { id: 3, buyer: 'TechBrand Inc', site: 'financepulse.com', type: 'link_insertion', price: 80, status: 'acceptance', created_at: '2026-08-06' },
  { id: 4, buyer: 'Sarah Johnson', site: 'bizgrowth.com', type: 'content_placement', price: 52, status: 'completed', created_at: '2026-08-08' },
];

const statusColors: Record<string, string> = {
  completed: '#38a169', in_progress: '#3182ce', task_review: '#d69e2e',
  acceptance: '#dd6b20', rejected: '#e53e3e',
};

export default async function PublisherOrdersPage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'publisher') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as publisher.</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Orders</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>#</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Buyer</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Site</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Type</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Price</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Status</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_ORDERS.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#94a3b8' }}>#{o.id}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 500 }}>{o.buyer}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', color: '#2563eb' }}>{o.site}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b', textTransform: 'capitalize' }}>{o.type.replace(/_/g, ' ')}</td>
              <td style={{ padding: '.75rem 1rem', fontWeight: 600 }}>${o.price}</td>
              <td style={{ padding: '.75rem 1rem' }}>
                <span style={{ display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12, background: `${statusColors[o.status]}20`, color: statusColors[o.status], fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                  {o.status.replace(/_/g, ' ')}
                </span>
              </td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>
                {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
