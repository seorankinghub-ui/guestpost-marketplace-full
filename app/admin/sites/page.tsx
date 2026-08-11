export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const DEMO_SITES = [
  { id: 1, domain: 'techinsider.com', owner: 'Mike Owner', moz_da: 72, ahrefs_dr: 68, traffic: '245K/mo', language: 'English', status: 'approved', created_at: '2026-07-05' },
  { id: 2, domain: 'healthwise.org', owner: 'Mike Owner', moz_da: 65, ahrefs_dr: 60, traffic: '180K/mo', language: 'English', status: 'approved', created_at: '2026-07-06' },
  { id: 3, domain: 'financepulse.com', owner: 'Mike Owner', moz_da: 58, ahrefs_dr: 54, traffic: '320K/mo', language: 'English', status: 'pending', created_at: '2026-07-08' },
  { id: 4, domain: 'travelvista.com', owner: 'Lisa Blogs', moz_da: 55, ahrefs_dr: 50, traffic: '95K/mo', language: 'English', status: 'approved', created_at: '2026-07-10' },
  { id: 5, domain: 'bizgrowth.com', owner: 'Lisa Blogs', moz_da: 48, ahrefs_dr: 44, traffic: '62K/mo', language: 'English', status: 'pending', created_at: '2026-07-12' },
  { id: 6, domain: 'lifestylehub.com', owner: 'Mike Owner', moz_da: 42, ahrefs_dr: 38, traffic: '41K/mo', language: 'English', status: 'approved', created_at: '2026-07-14' },
];

const statusColors: Record<string, string> = { approved: '#38a169', pending: '#d69e2e', rejected: '#e53e3e' };

export default async function AdminSitesPage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'admin') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as admin.</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Sites</h1>
      <div style={{ display: 'flex', gap: '.75rem', marginBottom: '1.25rem' }}>
        <span style={{ padding: '.4rem .75rem', borderRadius: 6, fontSize: '.8rem', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>
          All ({DEMO_SITES.length})
        </span>
        <span style={{ padding: '.4rem .75rem', borderRadius: 6, fontSize: '.8rem', fontWeight: 600, background: '#dcfce7', color: '#166534' }}>
          Approved ({DEMO_SITES.filter(s => s.status === 'approved').length})
        </span>
        <span style={{ padding: '.4rem .75rem', borderRadius: 6, fontSize: '.8rem', fontWeight: 600, background: '#fef9c3', color: '#854d0e' }}>
          Pending ({DEMO_SITES.filter(s => s.status === 'pending').length})
        </span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Domain</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Owner</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>DA/DR</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Traffic</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_SITES.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 600, color: '#2563eb' }}>{s.domain}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem' }}>{s.owner}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', fontWeight: 600 }}>
                DA {s.moz_da} / DR {s.ahrefs_dr}
              </td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{s.traffic}</td>
              <td style={{ padding: '.75rem 1rem' }}>
                <span style={{ display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12, background: `${statusColors[s.status]}20`, color: statusColors[s.status], fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
