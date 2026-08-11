export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

export default async function PublisherEarningsPage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'publisher') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as publisher.</div>;
  }

  const totalEarned = 307;
  const pendingPayout = 132;
  const paidOut = 175;
  const nextPayout = 'Aug 20, 2026';

  const transactions = [
    { id: 1, description: 'Order #1 — techinsider.com (completed)', amount: 95, type: 'credit', date: '2026-08-01' },
    { id: 2, description: 'Order #4 — bizgrowth.com (completed)', amount: 52, type: 'credit', date: '2026-08-08' },
    { id: 3, description: 'Order #3 — financepulse.com (processing)', amount: 80, type: 'pending', date: '2026-08-06' },
    { id: 4, description: 'Order #2 — healthwise.org (in progress)', amount: 92, type: 'pending', date: '2026-08-03' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Earnings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 500 }}>Total Earned</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>${totalEarned}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 500 }}>Pending Payout</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>${pendingPayout}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 500 }}>Paid Out</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#3b82f6' }}>${paidOut}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b', fontWeight: 500 }}>Next Payout</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{nextPayout}</div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Transaction History</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Description</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '.75rem 1rem', fontSize: '.9rem' }}>{t.description}</td>
                <td style={{ padding: '.75rem 1rem', fontWeight: 600, color: t.type === 'credit' ? '#10b981' : '#f59e0b' }}>
                  {t.type === 'credit' ? '+' : '~'}${t.amount}
                </td>
                <td style={{ padding: '.75rem 1rem' }}>
                  <span style={{ display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12, background: t.type === 'credit' ? '#dcfce7' : '#fef9c3', color: t.type === 'credit' ? '#166534' : '#854d0e', fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                    {t.type}
                  </span>
                </td>
                <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>
                  {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
