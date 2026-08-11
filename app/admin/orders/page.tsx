export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import PaymentActions from '../components/PaymentActions';

const DEMO_ORDERS = [
  { id: 1, buyer: 'Sarah Johnson', site: 'techinsider.com', publisher: 'Mike Owner', type: 'content_placement', price: 95, status: 'completed', paymentStatus: 'unpaid', created_at: '2026-08-01' },
  { id: 2, buyer: 'Digital Growth Agency', site: 'healthwise.org', publisher: 'Mike Owner', type: 'writing_placement', price: 92, status: 'completed', paymentStatus: 'unpaid', created_at: '2026-08-03' },
  { id: 3, buyer: 'TechBrand Inc', site: 'financepulse.com', publisher: 'Mike Owner', type: 'link_insertion', price: 80, status: 'acceptance', paymentStatus: 'unpaid', created_at: '2026-08-05' },
  { id: 4, buyer: 'Sarah Johnson', site: 'travelvista.com', publisher: 'Lisa Blogs', type: 'content_placement', price: 65, status: 'completed', paymentStatus: 'paid', created_at: '2026-08-07' },
  { id: 5, buyer: 'TechBrand Inc', site: 'bizgrowth.com', publisher: 'Lisa Blogs', type: 'writing_placement', price: 52, status: 'in_progress', paymentStatus: 'unpaid', created_at: '2026-08-09' },
];

const statusColors: Record<string, string> = {
  completed: '#38a169', in_progress: '#3182ce', task_review: '#d69e2e',
  acceptance: '#dd6b20', rejected: '#e53e3e', draft: '#718096',
};

export default async function AdminOrdersPage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'admin') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as admin.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Orders & Payments</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Manage orders — pay publishers or refund buyers.
          </p>
        </div>
        <a
          href="/admin/payments"
          style={{
            display: 'inline-block', padding: '0.6rem 1.25rem',
            background: '#8b5cf6', color: 'white', borderRadius: 8,
            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
          }}
        >
          📊 Full Payment Report →
        </a>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>#</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Buyer</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Site</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Publisher</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Order Status</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ORDERS.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#94a3b8' }}>#{o.id}</td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 500 }}>{o.buyer}</td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', color: '#2563eb' }}>{o.site}</td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{o.publisher}</td>
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
                <td style={{ padding: '.75rem 1rem', whiteSpace: 'nowrap' }}>
                  <PaymentActions
                    order={{
                      ...o,
                      paymentStatus: (o as any).paymentStatus as 'unpaid' | 'paid' | 'refunded' | undefined,
                    }}
                    onAction={() => {}}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 8, display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></span>
          Refund — returns money to buyer
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#059669' }}></span>
          Pay Publisher — pays site owner (75% of order, platform keeps 25%)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#38a169' }}></span>
          ✅ Paid — publisher already received payment
        </div>
      </div>
    </div>
  );
}
