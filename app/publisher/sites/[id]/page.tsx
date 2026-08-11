export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const sites: Record<string, any> = {
  '1': { domain: 'techinsider.com', moz_da: 72, ahrefs_dr: 68, traffic: '245K/mo', language: 'English', category: 'Technology', country: 'USA', status: 'approved', content_price: 95, writing_price: 115, orders_completed: 12, avg_tat: 3 },
  '2': { domain: 'healthwise.org', moz_da: 65, ahrefs_dr: 60, traffic: '180K/mo', language: 'English', category: 'Health', country: 'USA', status: 'approved', content_price: 78, writing_price: 92, orders_completed: 8, avg_tat: 4 },
  '3': { domain: 'financepulse.com', moz_da: 58, ahrefs_dr: 54, traffic: '320K/mo', language: 'English', category: 'Finance', country: 'USA', status: 'pending', content_price: 120, writing_price: 145, orders_completed: 0, avg_tat: 0 },
};

export default async function PublisherSiteDetailPage({ params }: { params: { id: string } }) {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'publisher') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as publisher.</div>;
  }

  const site = sites[params.id];
  if (!site) return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>Site not found.</div>;

  return (
    <div>
      <a href="/publisher/sites" style={{ color: '#2563eb', fontSize: '.85rem', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>← Back to Sites</a>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>{site.domain}</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        <span style={{ display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12, background: site.status === 'approved' ? '#dcfce7' : '#fef9c3', color: site.status === 'approved' ? '#166534' : '#854d0e', fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{site.status}</span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Moz DA</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{site.moz_da}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Ahrefs DR</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{site.ahrefs_dr}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Traffic</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{site.traffic}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.25rem' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Orders Done</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{site.orders_completed}</div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Pricing</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '.5rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b' }}>Service</th>
              <th style={{ padding: '.5rem', textAlign: 'left', fontSize: '.8rem', color: '#64748b' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '.5rem', fontWeight: 500 }}>Content Placement</td><td style={{ padding: '.5rem', fontWeight: 600 }}>${site.content_price}</td></tr>
            <tr><td style={{ padding: '.5rem', fontWeight: 500 }}>Writing + Placement</td><td style={{ padding: '.5rem', fontWeight: 600 }}>${site.writing_price}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
