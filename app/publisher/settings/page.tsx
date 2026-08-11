export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

export default async function PublisherSettingsPage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'publisher') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as publisher.</div>;
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Settings</h1>
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: '.4rem' }}>Name</label>
          <input type="text" defaultValue={session.name} style={{ width: '100%', padding: '.65rem', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: '.4rem' }}>Email</label>
          <input type="email" defaultValue={session.email} disabled style={{ width: '100%', padding: '.65rem', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box', background: '#f1f5f9' }} />
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: '.4rem' }}>Payout Method</label>
          <select style={{ width: '100%', padding: '.65rem', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box', background: 'white' }}>
            <option>PayPal</option>
            <option>Bank Transfer</option>
            <option>Payoneer</option>
          </select>
        </div>
        <button style={{ width: '100%', background: '#2563eb', color: 'white', padding: '.75rem', border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
