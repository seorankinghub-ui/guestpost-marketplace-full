export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

const orders: Record<string, any> = {
  '1': { id: 1, buyer: 'Sarah Johnson', buyer_email: 'buyer@example.com', site: 'techinsider.com', type: 'content_placement', price: 95, status: 'completed', created_at: '2026-08-01', content: 'SEO strategies for tech startups...', promoted_url: 'https://client.com/article' },
  '2': { id: 2, buyer: 'Digital Growth Agency', buyer_email: 'agency@example.com', site: 'healthwise.org', type: 'writing_placement', price: 92, status: 'in_progress', created_at: '2026-08-03', promoted_url: 'https://agency.com/health-tech' },
  '3': { id: 3, buyer: 'TechBrand Inc', buyer_email: 'brand@example.com', site: 'financepulse.com', type: 'link_insertion', price: 80, status: 'acceptance', created_at: '2026-08-06', content: 'N/A (link insertion)', promoted_url: 'https://brand.com' },
  '4': { id: 4, buyer: 'Sarah Johnson', buyer_email: 'buyer@example.com', site: 'bizgrowth.com', type: 'content_placement', price: 52, status: 'completed', created_at: '2026-08-08', content: 'Small business growth tactics...', promoted_url: 'https://client.com/growth' },
};

const statusColors: Record<string, string> = {
  completed: '#38a169', in_progress: '#3182ce', task_review: '#d69e2e',
  acceptance: '#dd6b20', rejected: '#e53e3e',
};

export default async function PublisherOrderDetailPage({ params }: { params: { id: string } }) {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'publisher') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as publisher.</div>;
  }

  const order = orders[params.id];
  if (!order) return <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>Order not found.</div>;

  return (
    <div>
      <a href="/publisher/orders" style={{ color: '#2563eb', fontSize: '.85rem', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>← Back to Orders</a>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>Order #{order.id}</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        <span style={{ display: 'inline-block', padding: '.2rem .6rem', borderRadius: 12, background: `${statusColors[order.status]}20`, color: statusColors[order.status], fontSize: '.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{order.status.replace(/_/g, ' ')}</span>
      </p>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Order Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '.75rem', fontSize: '.9rem' }}>
          <div style={{ color: '#64748b', fontWeight: 500 }}>Buyer</div><div>{order.buyer} ({order.buyer_email})</div>
          <div style={{ color: '#64748b', fontWeight: 500 }}>Site</div><div style={{ color: '#2563eb' }}>{order.site}</div>
          <div style={{ color: '#64748b', fontWeight: 500 }}>Type</div><div style={{ textTransform: 'capitalize' }}>{order.type.replace(/_/g, ' ')}</div>
          <div style={{ color: '#64748b', fontWeight: 500 }}>Price</div><div style={{ fontWeight: 600 }}>${order.price}</div>
          <div style={{ color: '#64748b', fontWeight: 500 }}>Date</div><div>{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          <div style={{ color: '#64748b', fontWeight: 500 }}>Promoted URL</div><div style={{ wordBreak: 'break-all' }}>{order.promoted_url}</div>
        </div>
      </div>
    </div>
  );
}
