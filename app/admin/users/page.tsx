export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const DEMO_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@guestpost.com', role: 'admin', balance_main: 0, created_at: '2026-07-01' },
  { id: 2, name: 'Sarah Johnson', email: 'buyer@example.com', role: 'buyer', balance_main: 500, created_at: '2026-07-02' },
  { id: 3, name: 'Digital Growth Agency', email: 'agency@example.com', role: 'buyer', balance_main: 2500, created_at: '2026-07-05' },
  { id: 4, name: 'TechBrand Inc', email: 'brand@example.com', role: 'buyer', balance_main: 1000, created_at: '2026-07-08' },
  { id: 5, name: 'Mike Owner', email: 'publisher@example.com', role: 'publisher', balance_main: 0, created_at: '2026-07-10' },
  { id: 6, name: 'Lisa Blogs', email: 'publisher2@example.com', role: 'publisher', balance_main: 0, created_at: '2026-07-12' },
];

const roleColors: Record<string, string> = { admin: '#e53e3e', publisher: '#3182ce', buyer: '#38a169' };

export default async function AdminUsersPage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'admin') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as admin.</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Users</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>ID</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Name</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Email</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Role</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Balance</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Joined</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_USERS.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#94a3b8' }}>#{u.id}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 600 }}>{u.name}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{u.email}</td>
              <td style={{ padding: '.75rem 1rem' }}>
                <span style={{ display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12, background: `${roleColors[u.role]}20`, color: roleColors[u.role], fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                  {u.role}
                </span>
              </td>
              <td style={{ padding: '.75rem 1rem', fontWeight: 600 }}>${u.balance_main.toFixed(2)}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>
                {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
