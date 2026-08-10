'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: number; site_id: number; buyer_id: number; publisher_id: number | null;
  product_type: string; content: string | null; content_size_words: number;
  promoted_url: string | null; anchor_text: string | null; target_page_url: string | null;
  special_requirements: string | null; project_name: string | null;
  price: number; status: string; improvement_count: number;
  created_at: string; updated_at: string;
  site_domain: string; site_url: string;
  moz_da: number; ahrefs_dr: number; organic_traffic: number;
  categories: string; publisher_name: string | null;
}

interface Review {
  id: number; rating: number; comment: string;
  reviewer_name: string; created_at: string;
}

const starRating = (rating: number) => '⭐'.repeat(Math.round(rating)) + (rating < 1 ? '☆'.repeat(5) : '☆'.repeat(5 - Math.round(rating)));
const formatDate = (d: string) => new Date(d + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const statusColors: Record<string, string> = {
  draft: '#94a3b8', task_review: '#3b82f6', acceptance: '#eab308',
  in_progress: '#f97316', approval: '#8b5cf6', improvement: '#ec4899',
  completed: '#10b981', rejected: '#ef4444'
};

const statusLabels: Record<string, string> = {
  draft: 'Draft', task_review: 'In Review', acceptance: 'Accepted',
  in_progress: 'In Progress', approval: 'Pending Approval',
  improvement: 'Needs Improvement', completed: 'Completed', rejected: 'Rejected'
};

const timeline = [
  { status: 'draft', label: 'Draft', icon: '📝' },
  { status: 'task_review', label: 'In Review', icon: '👀' },
  { status: 'acceptance', label: 'Accepted', icon: '✅' },
  { status: 'in_progress', label: 'In Progress', icon: '⚙️' },
  { status: 'approval', label: 'Pending Approval', icon: '🔄' },
  { status: 'completed', label: 'Completed', icon: '🎉' },
];

const statusOrder = ['draft', 'task_review', 'acceptance', 'in_progress', 'approval', 'completed'];

export default function OrderDetailClient({
  order, reviews, balance
}: { order: Order; reviews: Review[]; balance: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const currentIndex = statusOrder.indexOf(order.status);
  const isRejected = order.status === 'rejected';
  const isImprovement = order.status === 'improvement';

  const handleAction = async (action: string) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Action failed');
      } else {
        setMessage(`Order ${action === 'approve' ? 'approved' : action === 'reject' ? 'sent back for improvement' : action === 'request_improvement' ? 'improvement requested' : 'cancelled'} successfully!`);
        setTimeout(() => router.refresh(), 800);
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const productTypeLabel = order.product_type === 'content_placement' ? 'Content Placement'
    : order.product_type === 'writing_placement' ? 'Writing & Placement'
    : 'Link Insertion';

  const cats = (() => { try { return JSON.parse(order.categories); } catch { return []; } })();

  return (
    <div>
      <a href="/orders" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '.85rem', display: 'inline-block', marginBottom: '1rem' }}>
        ← Back to Orders
      </a>

      {/* Header */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Order #{order.id}</h1>
              <span style={{
                padding: '.25rem .75rem', borderRadius: 12, fontSize: '.8rem', fontWeight: 600,
                background: (statusColors[order.status] || '#94a3b8') + '20',
                color: statusColors[order.status] || '#94a3b8'
              }}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '.85rem', flexWrap: 'wrap' }}>
              <span>📅 {formatDate(order.created_at)}</span>
              <span>🏷️ {productTypeLabel}</span>
              <a href={`/catalog/${order.site_id}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                🌐 {order.site_domain}
              </a>
            </div>
            <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem', flexWrap: 'wrap' }}>
              {cats.map((c: string) => (
                <span key={c} style={{ padding: '.15rem .6rem', background: '#eff6ff', color: '#2563eb', borderRadius: 12, fontSize: '.75rem', fontWeight: 500 }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#2563eb' }}>${order.price.toFixed(2)}</div>
            <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>
              DA {order.moz_da} · DR {order.ahrefs_dr} · {order.organic_traffic.toLocaleString()} visits
            </div>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Order Progress</h2>
        {isRejected ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>❌</div>
            <div style={{ fontWeight: 600 }}>Order Rejected</div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {timeline.map((step, i) => {
              const isCompleted = statusOrder.indexOf(order.status) >= statusOrder.indexOf(step.status) &&
                order.status !== 'rejected';
              const rejectedAfter = isRejected && statusOrder.indexOf(step.status) < currentIndex;

              return (
                <div key={step.status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                  {i < timeline.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 18, left: '50%', width: '100%', height: 3,
                      background: isCompleted ? '#2563eb' : '#e2e8f0', zIndex: 0
                    }} />
                  )}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isCompleted ? '#2563eb' : rejectedAfter ? '#ef4444' : '#f1f5f9',
                    color: isCompleted || rejectedAfter ? 'white' : '#94a3b8',
                    fontSize: '1rem', position: 'relative', zIndex: 1, fontWeight: 700
                  }}>
                    {step.icon}
                  </div>
                  <div style={{
                    fontSize: '.65rem', color: isCompleted ? '#2563eb' : '#94a3b8',
                    marginTop: '.5rem', textAlign: 'center', fontWeight: isCompleted ? 600 : 400
                  }}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Order Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
            <div>
              <div style={{ fontSize: '.75rem', color: '#64748b' }}>Product Type</div>
              <div style={{ fontWeight: 600 }}>{productTypeLabel}</div>
            </div>
            {order.project_name && (
              <div>
                <div style={{ fontSize: '.75rem', color: '#64748b' }}>Project Name</div>
                <div style={{ fontWeight: 600 }}>{order.project_name}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: '.75rem', color: '#64748b' }}>Promoted URL</div>
              <div style={{ color: '#2563eb', fontSize: '.9rem' }}>
                {order.promoted_url ? <a href={order.promoted_url} target="_blank" rel="noreferrer">{order.promoted_url}</a> : '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '.75rem', color: '#64748b' }}>Anchor Text</div>
              <div style={{ fontWeight: 500 }}>{order.anchor_text || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '.75rem', color: '#64748b' }}>Publisher</div>
              <div style={{ fontWeight: 500 }}>{order.publisher_name || 'Unassigned'}</div>
            </div>
            {order.target_page_url && (
              <div>
                <div style={{ fontSize: '.75rem', color: '#64748b' }}>Target Page URL</div>
                <div style={{ color: '#2563eb', fontSize: '.9rem' }}>
                  <a href={order.target_page_url} target="_blank" rel="noreferrer">{order.target_page_url}</a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Site Info</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }}>
            {[
              { label: 'Domain', value: order.site_domain },
              { label: 'DA', value: order.moz_da },
              { label: 'DR', value: order.ahrefs_dr },
              { label: 'Traffic', value: order.organic_traffic.toLocaleString() + '/mo' },
              { label: 'Categories', value: cats.join(', ') },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: '.75rem', color: '#64748b' }}>{m.label}</div>
                <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Preview */}
      {order.content && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '.75rem' }}>Content Preview</h2>
          <div style={{
            background: '#f8fafc', padding: '1rem', borderRadius: 8,
            fontSize: '.9rem', color: '#475569', lineHeight: 1.7,
            whiteSpace: 'pre-wrap', maxHeight: 400, overflowY: 'auto'
          }}>
            {order.content}
          </div>
        </div>
      )}

      {/* Special Requirements */}
      {order.special_requirements && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '.75rem' }}>Special Requirements</h2>
          <div style={{ fontSize: '.9rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {order.special_requirements}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {(order.status === 'approval' || order.status === 'draft' || order.status === 'task_review') && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Actions</h2>
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            {order.status === 'approval' && (
              <>
                <button onClick={() => handleAction('approve')} disabled={loading} style={{
                  padding: '.7rem 1.5rem', background: loading ? '#94a3b8' : '#10b981', color: 'white',
                  border: 'none', borderRadius: 8, fontWeight: 600, cursor: loading ? 'default' : 'pointer'
                }}>
                  ✅ Approve & Complete
                </button>
                <button onClick={() => handleAction('request_improvement')} disabled={loading} style={{
                  padding: '.7rem 1.5rem', background: loading ? '#94a3b8' : '#f59e0b', color: 'white',
                  border: 'none', borderRadius: 8, fontWeight: 600, cursor: loading ? 'default' : 'pointer'
                }}>
                  🔄 Request Improvement
                </button>
                <button onClick={() => handleAction('reject')} disabled={loading} style={{
                  padding: '.7rem 1.5rem', background: loading ? '#94a3b8' : '#ef4444', color: 'white',
                  border: 'none', borderRadius: 8, fontWeight: 600, cursor: loading ? 'default' : 'pointer'
                }}>
                  ❌ Reject
                </button>
              </>
            )}
            {(order.status === 'draft' || order.status === 'task_review') && (
              <button onClick={() => handleAction('cancel')} disabled={loading} style={{
                padding: '.7rem 1.5rem', background: loading ? '#94a3b8' : '#ef4444', color: 'white',
                border: 'none', borderRadius: 8, fontWeight: 600, cursor: loading ? 'default' : 'pointer'
              }}>
                🗑️ Cancel Order
              </button>
            )}
          </div>
          {message && (
            <div style={{
              marginTop: '1rem', padding: '.75rem', borderRadius: 8, fontSize: '.85rem',
              background: message.includes('successfully') ? '#f0fdf4' : '#fef2f2',
              color: message.includes('successfully') ? '#10b981' : '#ef4444',
              border: `1px solid ${message.includes('successfully') ? '#bbf7d0' : '#fecaca'}`
            }}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
