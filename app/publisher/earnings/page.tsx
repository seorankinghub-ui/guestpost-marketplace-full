'use client';

import { useState, useEffect } from 'react';

const styles: Record<string, React.CSSProperties> = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 4 },
  pageSub: { fontSize: 14, color: '#718096', marginBottom: 24 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 },
  statCard: { backgroundColor: '#fff', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0' },
  statValue: { fontSize: 28, fontWeight: 700, color: '#1a202c' },
  statLabel: { fontSize: 13, color: '#718096', marginTop: 4 },
  withdrawBtn: { padding: '10px 22px', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: '#2d3748', marginBottom: 14 },
  table: { width: '100%', borderCollapse: 'collapse' as const, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' },
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f7fafc' },
  td: { padding: '12px 16px', fontSize: 13, color: '#4a5568', borderBottom: '1px solid #edf2f7' },
  message: { padding: '10px 16px', borderRadius: 6, fontSize: 13, marginBottom: 16 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' as const, gap: 12, marginBottom: 20 },
};

export default function PublisherEarnings() {
  const [earnings, setEarnings] = useState({ totalEarned: 0, available: 0, nextPayout: '' });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [earnRes, txRes] = await Promise.all([
          fetch('/api/wallet?type=earnings'),
          fetch('/api/wallet?type=transactions'),
        ]);
        if (earnRes.ok) setEarnings(await earnRes.json());
        if (txRes.ok) setTransactions((await txRes.json()).transactions || []);
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  function getNextPayoutDate(): string {
    const now = new Date();
    const day = now.getDate();
    let next;
    if (day < 5) {
      next = new Date(now.getFullYear(), now.getMonth(), 5);
    } else if (day < 20) {
      next = new Date(now.getFullYear(), now.getMonth(), 20);
    } else {
      next = new Date(now.getFullYear(), now.getMonth() + 1, 5);
    }
    return next.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  async function handleWithdraw() {
    setWithdrawing(true);
    setMessage('');
    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'withdraw' }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Withdrawal requested successfully');
      } else {
        setMessage(data.error || 'Withdrawal failed');
      }
    } catch {
      setMessage('An error occurred');
    } finally {
      setWithdrawing(false);
    }
  }

  if (loading) return <div style={{ padding: 40, color: '#718096' }}>Loading...</div>;

  const nextPayout = earnings.nextPayout || getNextPayoutDate();

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Earnings</h1>
          <p style={styles.pageSub}>Track your income and request withdrawals.</p>
        </div>
        <button style={{ ...styles.withdrawBtn, opacity: withdrawing ? 0.7 : 1 }} onClick={handleWithdraw} disabled={withdrawing}>
          {withdrawing ? 'Processing...' : '💸 Withdraw'}
        </button>
      </div>

      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.toLowerCase().includes('error') ? '#fff5f5' : '#f0fff4',
          border: `1px solid ${message.toLowerCase().includes('error') ? '#feb2b2' : '#c6f6d5'}`,
          color: message.toLowerCase().includes('error') ? '#c53030' : '#22543d',
        }}>
          {message}
        </div>
      )}

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>${Number(earnings.totalEarned || 0).toFixed(2)}</div>
          <div style={styles.statLabel}>Total Earned</div>
        </div>
        <div style={{ ...styles.statCard, border: '2px solid #c6f6d5' }}>
          <div style={{ ...styles.statValue, color: '#38a169' }}>${Number(earnings.available || 0).toFixed(2)}</div>
          <div style={styles.statLabel}>Available for Withdrawal</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{nextPayout}</div>
          <div style={styles.statLabel}>Next Payout Date</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>Payouts on 5th & 20th</div>
          <div style={styles.statLabel}>Schedule</div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Transaction History</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx: any) => (
              <tr key={tx.id}>
                <td style={styles.td}>{new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td style={styles.td}>{tx.type.replace(/_/g, ' ')}</td>
                <td style={styles.td}>{tx.description || '-'}</td>
                <td style={{ ...styles.td, fontWeight: 600, color: tx.type === 'payout' || tx.type === 'release' ? '#38a169' : '#4a5568' }}>
                  {tx.type === 'payout' ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td style={{ ...styles.td, textAlign: 'center', color: '#a0aec0' }} colSpan={4}>No transactions yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
