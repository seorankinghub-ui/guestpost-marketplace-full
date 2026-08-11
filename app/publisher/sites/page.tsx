export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const DEMO_SITES = [
  { id: 1, domain: 'techinsider.com', status: 'approved', moz_da: 72, ahrefs_dr: 68, traffic: '245K/mo', language: 'English', category: 'Technology', content_price: 95, writing_price: 115 },
  { id: 2, domain: 'healthwise.org', status: 'approved', moz_da: 65, ahrefs_dr: 60, traffic: '180K/mo', language: 'English', category: 'Health', content_price: 78, writing_price: 92 },
  { id: 3, domain: 'financepulse.com', status: 'pending', moz_da: 58, ahrefs_dr: 54, traffic: '320K/mo', language: 'English', category: 'Finance', content_price: 120, writing_price: 145 },
];

export default async function PublisherSitesPage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'publisher') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as publisher.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Sites</h1>
        <a href="/publisher/sites/add" style={{ background: '#2563eb', color: 'white', padding: '.6rem 1.25rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '.9rem' }}>
          ➕ Add Site
        </a>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Domain</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Category</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>DA/DR</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Traffic</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Price (Content/Writing)</th>
            <th style={{ padding: '.75rem 1rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b', fontWeight: 600 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {DEMO_SITES.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '.75rem 1rem', fontSize: '.9rem', fontWeight: 600, color: '#2563eb' }}>
                <a href={`/publisher/sites/${s.id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{s.domain}</a>
              </td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{s.category}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', fontWeight: 600 }}>DA {s.moz_da} / DR {s.ahrefs_dr}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem', color: '#64748b' }}>{s.traffic}</td>
              <td style={{ padding: '.75rem 1rem', fontSize: '.85rem' }}>
                ${s.content_price} / ${s.writing_price}
              </td>
              <td style={{ padding: '.75rem 1rem' }}>
                <span style={{ display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12, background: s.status === 'approved' ? '#dcfce7' : '#fef9c3', color: s.status === 'approved' ? '#166534' : '#854d0e', fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
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
