export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

interface Payment {
  id: number;
  orderId: number;
  type: 'publisher_payout' | 'refund' | 'deposit';
  from: string;
  to: string;
  amount: number;
  platformFee: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  date: string;
  note: string;
}

const DEMO_PAYMENTS: Payment[] = [
  { id: 1, orderId: 4, type: 'publisher_payout', from: 'Platform', to: 'Lisa Blogs', amount: 48.75, platformFee: 16.25, status: 'completed', method: 'PayPal', date: '2026-08-08', note: 'travelvista.com content placement' },
  { id: 2, orderId: 1, type: 'refund', from: 'Platform', to: 'Sarah Johnson', amount: 95.00, platformFee: 0, status: 'completed', method: 'Stripe', date: '2026-08-06', note: 'Duplicate order — refunded in full' },
  { id: 3, orderId: 1, type: 'deposit', from: 'Sarah Johnson', to: 'Platform', amount: 500.00, platformFee: 0, status: 'completed', method: 'PayPal', date: '2026-07-02', note: 'Initial wallet deposit' },
  { id: 4, orderId: 2, type: 'publisher_payout', from: 'Platform', to: 'Mike Owner', amount: 69.00, platformFee: 23.00, status: 'pending', method: 'PayPal', date: '2026-08-10', note: 'healthwise.org writing + placement' },
  { id: 5, orderId: 3, type: 'publisher_payout', from: 'Platform', to: 'Mike Owner', amount: 60.00, platformFee: 20.00, status: 'failed', method: 'PayPal', date: '2026-08-09', note: 'financepulse.com link insertion — PayPal error' },
];

const statusColors: Record<string, string> = {
  completed: '#38a169',
  pending: '#d69e2e',
  failed: '#e53e3e',
};

const typeLabels: Record<string, { icon: string; label: string; color: string }> = {
  publisher_payout: { icon: '💰', label: 'Publisher Payout', color: '#059669' },
  refund: { icon: '↩️', label: 'Refund', color: '#dc2626' },
  deposit: { icon: '➕', label: 'Deposit', color: '#2563eb' },
};

export default async function AdminPaymentsPage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'admin') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as admin.</div>;
  }

  const totalPayouts = DEMO_PAYMENTS.filter(p => p.type === 'publisher_payout' && p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalRefunds = DEMO_PAYMENTS.filter(p => p.type === 'refund' && p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalPlatformFees = DEMO_PAYMENTS.filter(p => p.type === 'publisher_payout' && p.status === 'completed').reduce((s, p) => s + p.platformFee, 0);
  const pendingPayouts = DEMO_PAYMENTS.filter(p => p.type === 'publisher_payout' && p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  const summaryCards = [
    { label: 'Publisher Payouts', value: `$${totalPayouts.toFixed(2)}`, color: '#059669', icon: '💰' },
    { label: 'Total Refunds', value: `$${totalRefunds.toFixed(2)}`, color: '#dc2626', icon: '↩️' },
    { label: 'Platform Revenue', value: `$${totalPlatformFees.toFixed(2)}`, color: '#8b5cf6', icon: '🏦' },
    { label: 'Pending Payouts', value: `$${pendingPayouts.toFixed(2)}`, color: '#f59e0b', icon: '⏳' },
  ];

  const formatDate = (d: string) => {
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Payments</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Track all payouts, refunds, and platform revenue.
          </p>
        </div>
        <a
          href="/admin/orders"
          style={{
            display: 'inline-block', padding: '0.6rem 1.25rem',
            background: '#2563eb', color: 'white', borderRadius: 8,
            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
          }}
        >
          📋 View Orders →
        </a>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {summaryCards.map(card => (
          <div key={card.label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.25rem' }}>{card.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '.8rem', color: '#64748b' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Publisher Payout Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {/* Pending Publisher Payouts */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#fffbeb' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>⏳ Pending Publisher Payouts</h3>
          </div>
          <div style={{ padding: '1rem 1.25rem' }}>
            {[
              { publisher: 'Mike Owner', order: '#2 — healthwise.org', amount: 69.00 },
              { publisher: 'Mike Owner', order: '#3 — financepulse.com', amount: 60.00 },
            ].map((p, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: i > 0 ? '0.75rem 0' : '0 0 0.75rem',
                borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.publisher}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.order}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#059669', fontSize: '1rem' }}>${p.amount.toFixed(2)}</div>
              </div>
            ))}
            <button
              disabled
              style={{
                marginTop: '0.75rem', width: '100%', padding: '0.5rem',
                background: '#f59e0b', color: 'white', border: 'none',
                borderRadius: 6, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', opacity: 0.5,
              }}
            >
              Process All Payouts (coming soon)
            </button>
          </div>
        </div>

        {/* Platform Revenue Summary */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f5f3ff' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>🏦 Platform Revenue (25% Fee)</h3>
          </div>
          <div style={{ padding: '1rem 1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.9rem', color: '#475569' }}>Total orders processed:</span>
                <span style={{ fontWeight: 600 }}>5</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.9rem', color: '#475569' }}>Total buyer payments:</span>
                <span style={{ fontWeight: 600 }}>$384.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.9rem', color: '#475569' }}>Paid to publishers:</span>
                <span style={{ color: '#059669' }}>$48.75</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Platform retained:</span>
                <span style={{ fontWeight: 700, color: '#8b5cf6', fontSize: '1.1rem' }}>$16.25</span>
              </div>
            </div>
            <div style={{
              background: '#f8fafc', borderRadius: 6, padding: '0.75rem',
              fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5,
            }}>
              <strong style={{ color: '#475569' }}>How the 25% fee works:</strong><br />
              Buyer pays full price → Order completed → Admin pays publisher 75% → Platform keeps 25%.
              For a $100 order, publisher gets $75 and platform earns $25.
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Payment History</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Order</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>From → To</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Platform Fee</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Method</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_PAYMENTS.map(p => {
              const typeInfo = typeLabels[p.type];
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {formatDate(p.date)}
                  </td>
                  <td style={{ padding: '.75rem 1rem', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, background: `${typeInfo.color}15`, color: typeInfo.color, fontSize: '.75rem', fontWeight: 600 }}>
                      {typeInfo.icon} {typeInfo.label}
                    </span>
                  </td>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#2563eb' }}>#{p.orderId}</td>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.85rem' }}>
                    <span style={{ color: '#64748b' }}>{p.from}</span> → <span style={{ fontWeight: 500 }}>{p.to}</span>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{p.note}</div>
                  </td>
                  <td style={{ padding: '.75rem 1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    <span style={{ color: p.type === 'refund' ? '#dc2626' : '#059669' }}>
                      {p.type === 'refund' ? '-' : '+'}${p.amount.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', whiteSpace: 'nowrap' }}>
                    {p.platformFee > 0 ? `$${p.platformFee.toFixed(2)}` : '-'}
                  </td>
                  <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{p.method}</td>
                  <td style={{ padding: '.75rem 1rem' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 12,
                      background: `${statusColors[p.status]}18`,
                      color: statusColors[p.status],
                      fontSize: '.75rem', fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
