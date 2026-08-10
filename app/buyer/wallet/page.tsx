'use client';

import { useEffect, useState } from 'react';

interface Balances {
  main: number;
  reserved: number;
  bonus: number;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  balance_type: string;
  description: string;
  created_at: string;
}

const formatDate = (d: string) => new Date(d + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatPrice = (p: number) => `$${p.toFixed(2)}`;

const typeColors: Record<string, string> = {
  deposit: '#10b981', reserve: '#f59e0b', release: '#3b82f6',
  refund: '#8b5cf6', bonus: '#ec4899', payout: '#ef4444'
};

export default function WalletPage() {
  const [balances, setBalances] = useState<Balances>({ main: 0, reserved: 0, bonus: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [depositing, setDepositing] = useState(false);
  const [depositMsg, setDepositMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    fetch('/api/wallet')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else {
          setBalances(data.balances);
          setTransactions(data.transactions);
        }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load wallet data'); setLoading(false); });
  };

  useEffect(() => { loadData(); }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setDepositMsg('Please enter a valid amount'); return; }
    if (amt > 10000) { setDepositMsg('Max deposit is $10,000 per transaction'); return; }

    setDepositing(true);
    setDepositMsg('');
    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDepositMsg(data.error || 'Failed to add funds');
      } else {
        setDepositMsg(`Successfully added ${formatPrice(amt)}!`);
        setAmount('');
        setBalances(data.balances);
        // Reload transactions
        const tRes = await fetch('/api/wallet');
        const tData = await tRes.json();
        setTransactions(tData.transactions);
      }
    } catch {
      setDepositMsg('Network error. Please try again.');
    } finally {
      setDepositing(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading wallet...</div>;
  if (error && !balances.main) return <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>;

  const balanceCards = [
    { label: 'Main Balance', value: balances.main, icon: '💳', color: '#2563eb', bg: '#eff6ff', desc: 'Available for new orders' },
    { label: 'Reserved', value: balances.reserved, icon: '🔒', color: '#f59e0b', bg: '#fffbeb', desc: 'Held for active orders' },
    { label: 'Bonus Balance', value: balances.bonus, icon: '🎁', color: '#8b5cf6', bg: '#f5f3ff', desc: 'Earned from referrals & promos' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>Wallet</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Manage your funds and transaction history.
      </p>

      {/* Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {balanceCards.map(card => (
          <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.color}20`, borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{card.icon}</div>
            <div style={{ fontSize: '.75rem', color: '#64748b', fontWeight: 500, marginBottom: '.25rem' }}>{card.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: card.color }}>{formatPrice(card.value)}</div>
            <div style={{ fontSize: '.75rem', color: '#94a3b8', marginTop: '.25rem' }}>{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Add Funds */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Add Funds</h2>
        <form onSubmit={handleDeposit} style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#64748b' }}>Amount (USD)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="100" min="1" max="10000" step="0.01" style={{
                padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6,
                fontSize: '.95rem', width: 160
              }} />
          </div>
          <button type="submit" disabled={depositing} style={{
            padding: '.6rem 1.5rem', background: depositing ? '#94a3b8' : '#2563eb', color: 'white',
            border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '.9rem', cursor: depositing ? 'default' : 'pointer'
          }}>
            {depositing ? 'Processing...' : '💳 Add Funds'}
          </button>
        </form>
        {depositMsg && (
          <div style={{
            marginTop: '.75rem', padding: '.6rem .75rem', borderRadius: 6, fontSize: '.85rem',
            background: depositMsg.includes('Successfully') ? '#f0fdf4' : '#fef2f2',
            color: depositMsg.includes('Successfully') ? '#10b981' : '#ef4444',
            border: `1px solid ${depositMsg.includes('Successfully') ? '#bbf7d0' : '#fecaca'}`
          }}>
            {depositMsg}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Transaction History</h2>
        </div>
        {transactions.length === 0 ? (
          <div style={{ padding: '3rem 1.25rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>📭</div>
            <p>No transactions yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Balance Type</th>
                  <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx: Transaction) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{formatDate(tx.created_at)}</td>
                    <td style={{ padding: '.75rem 1rem' }}>
                      <span style={{
                        display: 'inline-block', padding: '.15rem .5rem', borderRadius: 10,
                        background: (typeColors[tx.type] || '#94a3b8') + '20',
                        color: typeColors[tx.type] || '#94a3b8',
                        fontSize: '.75rem', fontWeight: 600
                      }}>
                        {tx.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{
                      padding: '.75rem 1rem', fontWeight: 600, fontSize: '.9rem',
                      color: tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'bonus' ? '#10b981' : '#ef4444'
                    }}>
                      {tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'bonus' ? '+' : '-'}{formatPrice(tx.amount)}
                    </td>
                    <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{tx.balance_type}</td>
                    <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#475569' }}>{tx.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
