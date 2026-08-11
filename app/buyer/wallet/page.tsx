export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

const TRANSACTIONS = [
  { id:1, type:'deposit', amount:500, description:'Initial deposit via PayPal', created_at:'2026-07-02' },
  { id:2, type:'payment', amount:-95, description:'Order #1 — techinsider.com', created_at:'2026-08-01', order_id:1 },
  { id:3, type:'payment', amount:-92, description:'Order #2 — healthwise.org', created_at:'2026-08-03', order_id:2 },
  { id:4, type:'payment', amount:-120, description:'Order #3 — financepulse.com', created_at:'2026-08-08', order_id:3 },
  { id:5, type:'refund', amount:50, description:'Partial refund — order cancellation', created_at:'2026-08-10' },
];

export default async function WalletPage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session) return <div style={{ padding:'2rem', textAlign:'center' }}>🔐 Please log in.</div>;

  const balance = session.balance_main || 500;
  const reserved = session.balance_reserved || 0;
  const bonus = session.balance_bonus || 0;

  return (
    <div>
      <h1 style={{ fontSize:'1.75rem', fontWeight:700, marginBottom:'1.5rem' }}>Wallet</h1>

      {/* Balance cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'1rem', marginBottom:'2rem' }}>
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:10, padding:'1.25rem' }}>
          <div style={{ fontSize:'.8rem', color:'#64748b', fontWeight:500 }}>Available Balance</div>
          <div style={{ fontSize:'2rem', fontWeight:700, color:'#10b981', marginTop:'.25rem' }}>${balance.toFixed(2)}</div>
        </div>
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:10, padding:'1.25rem' }}>
          <div style={{ fontSize:'.8rem', color:'#64748b', fontWeight:500 }}>Reserved (Escrow)</div>
          <div style={{ fontSize:'2rem', fontWeight:700, color:'#f59e0b', marginTop:'.25rem' }}>${reserved.toFixed(2)}</div>
        </div>
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:10, padding:'1.25rem' }}>
          <div style={{ fontSize:'.8rem', color:'#64748b', fontWeight:500 }}>Bonus Credits</div>
          <div style={{ fontSize:'2rem', fontWeight:700, color:'#8b5cf6', marginTop:'.25rem' }}>${bonus.toFixed(2)}</div>
        </div>
      </div>

      {/* Add funds button */}
      <Link href="/buyer/wallet" style={{
        display:'inline-block', background:'#2563eb', color:'white', padding:'.6rem 1.5rem',
        borderRadius:8, textDecoration:'none', fontWeight:600, fontSize:'.9rem', marginBottom:'2rem'
      }}>➕ Add Funds</Link>

      {/* Transaction history */}
      <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:10, overflow:'hidden' }}>
        <div style={{ padding:'1.25rem', borderBottom:'1px solid #e2e8f0' }}>
          <h2 style={{ fontSize:'1.1rem', fontWeight:600 }}>Transaction History</h2>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
              <th style={{ padding:'.75rem 1rem', textAlign:'left', fontSize:'.8rem', color:'#64748b', fontWeight:600 }}>Description</th>
              <th style={{ padding:'.75rem 1rem', textAlign:'left', fontSize:'.8rem', color:'#64748b', fontWeight:600 }}>Amount</th>
              <th style={{ padding:'.75rem 1rem', textAlign:'left', fontSize:'.8rem', color:'#64748b', fontWeight:600 }}>Type</th>
              <th style={{ padding:'.75rem 1rem', textAlign:'left', fontSize:'.8rem', color:'#64748b', fontWeight:600 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map(t => (
              <tr key={t.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                <td style={{ padding:'.75rem 1rem', fontSize:'.9rem' }}>
                  {t.description}
                  {t.order_id && <Link href={`/buyer/orders/${t.order_id}`} style={{ color:'#2563eb', fontSize:'.75rem', marginLeft:'.5rem', textDecoration:'none' }}>View →</Link>}
                </td>
                <td style={{ padding:'.75rem 1rem', fontWeight:600, color: t.amount >= 0 ? '#10b981' : '#ef4444' }}>
                  {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                </td>
                <td style={{ padding:'.75rem 1rem' }}>
                  <span style={{ display:'inline-block', padding:'.15rem .5rem', borderRadius:12, fontSize:'.7rem', fontWeight:600, textTransform:'capitalize',
                    background: t.type === 'deposit' ? '#dcfce7' : t.type === 'refund' ? '#dbeafe' : '#fee2e2',
                    color: t.type === 'deposit' ? '#166534' : t.type === 'refund' ? '#1d4ed8' : '#dc2626' }}>
                    {t.type}
                  </span>
                </td>
                <td style={{ padding:'.75rem 1rem', fontSize:'.85rem', color:'#64748b' }}>
                  {new Date(t.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
