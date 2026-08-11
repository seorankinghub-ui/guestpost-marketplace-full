export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const allSites: Record<string, any> = {
  '1': { id: 1, domain: 'techinsider.com', moz_da: 72, ahrefs_dr: 68, traffic: '245K/mo', language: 'English', categories: 'Technology,SaaS', country: 'USA', content_price: 95, writing_price: 115, status: 'approved', publisher: 'Mike Owner', rating: 4.8, completed_orders: 45, avg_tat: '3 days', description: 'Leading technology blog covering software, SaaS trends, startup culture, and product reviews. Strong editorial standards and a loyal readership of tech professionals.' },
  '2': { id: 2, domain: 'healthwise.org', moz_da: 65, ahrefs_dr: 60, traffic: '180K/mo', language: 'English', categories: 'Health,Wellness', country: 'USA', content_price: 78, writing_price: 92, status: 'approved', publisher: 'Mike Owner', rating: 4.7, completed_orders: 32, avg_tat: '4 days', description: 'Trusted health and wellness resource featuring evidence-based articles, nutrition guides, and mental health content.' },
  '3': { id: 3, domain: 'financepulse.com', moz_da: 58, ahrefs_dr: 54, traffic: '320K/mo', language: 'English', categories: 'Finance,Investing', country: 'USA', content_price: 120, writing_price: 145, status: 'approved', publisher: 'Mike Owner', rating: 4.9, completed_orders: 28, avg_tat: '5 days', description: 'Premier finance publication with daily market analysis, investment strategies, and personal finance advice. High editorial gatekeeping ensures quality.' },
};

export default async function SiteDetailPage({ params }: { params: { id: string } }) {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session) {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in.</div>;
  }

  const site = allSites[params.id];
  if (!site) return <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>Site not found.</div>;

  return (
    <div>
      <a href="/buyer/catalog" style={{ color: '#2563eb', fontSize: '.85rem', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>← Back to Catalog</a>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>{site.domain}</h1>
          <p style={{ color: '#64748b' }}>by {site.publisher} • ⭐ {site.rating} • {site.completed_orders} orders</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>Content Placement</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2563eb' }}>${site.content_price}</div>
          <div style={{ fontSize: '.8rem', color: '#64748b', marginTop: '.25rem' }}>Writing + Placement: ${site.writing_price}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Moz DA</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{site.moz_da}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Ahrefs DR</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{site.ahrefs_dr}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Traffic</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{site.traffic}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Avg TAT</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{site.avg_tat}</div>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '.75rem' }}>About This Site</h2>
        <p style={{ color: '#64748b', fontSize: '.9rem', lineHeight: 1.7 }}>{site.description}</p>
      </div>

      <div style={{ display: 'flex', gap: '.75rem' }}>
        <a href={`/buyer/orders?site=${site.id}`} style={{ background: '#2563eb', color: 'white', padding: '.75rem 2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Place Order — ${site.content_price}
        </a>
      </div>
    </div>
  );
}
