export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

interface Props { searchParams: { [key: string]: string | undefined }; }

const DEMO_ORDERS = [
  { id: 3, site_domain: 'financepulse.com', site_url: 'https://financepulse.com', product_type: 'content_placement', price: 120, status: 'task_review', created_at: '2026-08-08', content_size_words: 750 },
  { id: 2, site_domain: 'healthwise.org', site_url: 'https://healthwise.org', product_type: 'writing_placement', price: 92, status: 'in_progress', created_at: '2026-08-03', content_size_words: 1000 },
  { id: 1, site_domain: 'techinsider.com', site_url: 'https://techinsider.com', product_type: 'content_placement', price: 95, status: 'completed', created_at: '2026-08-01', content_size_words: 500 },
];

const statusColors: Record<string, string> = { completed:'#38a169', in_progress:'#3182ce', task_review:'#d69e2e', acceptance:'#dd6b20', approval:'#805ad5', improvement:'#d53f8c', draft:'#718096', rejected:'#e53e3e' };

export default async function BuyerOrdersPage({ searchParams }: Props) {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session) return <div style={{ padding:'2rem', textAlign:'center' }}>🔐 Please log in.</div>;

  const status = searchParams.status || 'all';

  const tabs = [
    { key:'all', label:'All' },
    { key:'draft', label:'Draft' },
    { key:'task_review', label:'In Review' },
    { key:'acceptance', label:'Accepted' },
    { key:'in_progress', label:'In Progress' },
    { key:'approval', label:'Pending Approval' },
    { key:'completed', label:'Completed' },
    { key:'rejected', label:'Rejected' },
  ];

  const filtered = status === 'all' ? DEMO_ORDERS : DEMO_ORDERS.filter(o => o.status === status);

  return (
    <div>
      <h1 style={{ fontSize:'1.75rem', fontWeight:700, marginBottom:'.25rem' }}>My Orders</h1>
      <p style={{ color:'#64748b', marginBottom:'1.5rem' }}>Track and manage all your guest post orders.</p>

      <div style={{ display:'flex', flexWrap:'wrap', gap:'.25rem', marginBottom:'1.5rem', overflowX:'auto' }}>
        {tabs.map(tab => {
          const count = tab.key === 'all' ? DEMO_ORDERS.length : DEMO_ORDERS.filter(o => o.status === tab.key).length;
          return (
            <Link key={tab.key} href={`/buyer/orders?status=${tab.key}`} style={{
              padding:'.5rem .9rem', borderRadius:6, fontSize:'.8rem', fontWeight:500, textDecoration:'none',
              background: status === tab.key ? '#2563eb' : '#f1f5f9',
              color: status === tab.key ? 'white' : '#475569', whiteSpace:'nowrap'
            }}>
              {tab.label} <span style={{ opacity:.7 }}>({count})</span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem 1rem', color:'#94a3b8' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📋</div>
          <h3>No orders found</h3>
          <p>Start by browsing sites and placing an order.</p>
          <Link href="/buyer/catalog" style={{ display:'inline-block', marginTop:'1rem', color:'#2563eb', textDecoration:'none', fontWeight:600 }}>Browse Sites →</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
          {filtered.map(order => (
            <Link key={order.id} href={`/buyer/orders/${order.id}`} style={{
              display:'block', background:'white', border:'1px solid #e2e8f0', borderRadius:10, padding:'1.25rem',
              textDecoration:'none', transition:'all .2s'
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.5rem' }}>
                <div>
                  <div style={{ fontWeight:600, color:'#1e293b', fontSize:'.95rem' }}>{order.site_domain}</div>
                  <div style={{ fontSize:'.75rem', color:'#94a3b8', textTransform:'capitalize', marginTop:'.15rem' }}>
                    {order.product_type.replace(/_/g,' ')} • {order.content_size_words} words
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:700, color:'#1e293b' }}>${order.price.toFixed(2)}</div>
                  <span style={{ display:'inline-block', marginTop:'.25rem', padding:'.15rem .5rem', borderRadius:12, fontSize:'.7rem', fontWeight:600,
                    background: `${statusColors[order.status]}20`, color:statusColors[order.status], textTransform:'capitalize' }}>
                    {order.status.replace(/_/g,' ')}
                  </span>
                </div>
              </div>
              <div style={{ fontSize:'.75rem', color:'#94a3b8' }}>
                {new Date(order.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
