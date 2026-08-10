// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const statusColors: Record<string, string> = {
  completed: '#38a169',
  in_progress: '#3182ce',
  task_review: '#d69e2e',
  acceptance: '#dd6b20',
  rejected: '#e53e3e',
  draft: '#718096',
  approval: '#805ad5',
  improvement: '#d53f8c',
};

const productTypeLabels: Record<string, string> = {
  content_placement: 'Content Placement',
  writing_placement: 'Writing & Placement',
  link_insertion: 'Link Insertion',
};

const S: any = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20, overflow: 'hidden' },
  cardHeader: { padding: '16px 20px', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#2d3748' },
  cardBody: { padding: 20 },
  row: { display: 'flex', gap: 24, flexWrap: 'wrap' as const, marginBottom: 16 },
  detailCol: { flex: '1 1 200px' },
  detailLabel: { fontSize: 11, color: '#a0aec0', textTransform: 'uppercase' as const, fontWeight: 600, letterSpacing: '0.5px', marginBottom: 2 },
  detailValue: { fontSize: 14, color: '#2d3748', fontWeight: 500 },
  contentBox: { padding: 16, backgroundColor: '#f7fafc', borderRadius: 6, fontSize: 13, color: '#4a5568', lineHeight: 1.6, whiteSpace: 'pre-wrap' as const, marginBottom: 16 },
  actions: { display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid #edf2f7' },
  acceptBtn: { padding: '10px 24px', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  rejectBtn: { padding: '10px 24px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  completeBtn: { padding: '10px 24px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  backBtn: { padding: '10px 20px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  badge: (color: string): React.CSSProperties => ({
    display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
    backgroundColor: `${color}20`, color,
  }),
  success: { padding: '10px 16px', backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 6, color: '#22543d', fontSize: 13, marginBottom: 16 },
};

export default function PublisherOrderDetail() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { fetchOrder(); }, [params.id]);

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch {} finally { setLoading(false); }
  }

  async function handleAction(action: 'accept' | 'reject' | 'complete') {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Action completed successfully');
        fetchOrder();
      } else {
        setMessage(data.error || 'Action failed');
      }
    } catch {
      setMessage('An error occurred');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <div style={{ padding: 40, color: '#718096' }}>Loading...</div>;
  if (!order) return <div style={{ padding: 40, color: '#c53030' }}>Order not found.</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={S.pageTitle}>Order #{order.id}</h1>
        <button style={S.backBtn} onClick={() => window.history.back()}>← Back</button>
      </div>

      {message && <div style={{ ...S.success, color: message.includes('error') ? '#c53030' : '#22543d', backgroundColor: message.includes('error') ? '#fff5f5' : '#f0fff4', borderColor: message.includes('error') ? '#feb2b2' : '#c6f6d5' }}>{message}</div>}

      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={S.cardTitle}>Order Details</div>
          <span style={S.badge(statusColors[order.status] || '#718096')}>{order.status.replace(/_/g, ' ')}</span>
        </div>
        <div style={S.cardBody}>
          <div style={S.row}>
            <div style={S.detailCol}>
              <div style={S.detailLabel}>Product Type</div>
              <div style={S.detailValue}>{productTypeLabels[order.product_type] || order.product_type}</div>
            </div>
            <div style={S.detailCol}>
              <div style={S.detailLabel}>Price</div>
              <div style={{ ...S.detailValue, color: '#38a169', fontSize: 20, fontWeight: 700 }}>${Number(order.price).toFixed(2)}</div>
            </div>
            <div style={S.detailCol}>
              <div style={S.detailLabel}>Date</div>
              <div style={S.detailValue}>{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div style={S.detailCol}>
              <div style={S.detailLabel}>Site</div>
              <div style={S.detailValue}>{order.site_domain || 'N/A'}</div>
            </div>
          </div>

          <div style={S.row}>
            <div style={S.detailCol}>
              <div style={S.detailLabel}>Buyer</div>
              <div style={S.detailValue}>{order.buyer_name || 'N/A'} ({order.buyer_email || 'N/A'})</div>
            </div>
            <div style={S.detailCol}>
              <div style={S.detailLabel}>Promoted URL</div>
              <div style={{ ...S.detailValue, color: '#3182ce' }}>{order.promoted_url || 'N/A'}</div>
            </div>
            <div style={S.detailCol}>
              <div style={S.detailLabel}>Anchor Text</div>
              <div style={S.detailValue}>{order.anchor_text || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      {order.content && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Content</div>
          </div>
          <div style={S.cardBody}>
            <div style={S.contentBox}>{order.content}</div>
          </div>
        </div>
      )}

      {(order.status === 'acceptance' || order.status === 'in_progress') && (
        <div style={S.card}>
          <div style={S.actions}>
            {order.status === 'acceptance' && (
              <>
                <button style={S.acceptBtn} disabled={actionLoading} onClick={() => handleAction('accept')}>
                  {actionLoading ? 'Processing...' : '✅ Accept Order'}
                </button>
                <button style={S.rejectBtn} disabled={actionLoading} onClick={() => handleAction('reject')}>
                  {actionLoading ? 'Processing...' : '❌ Reject Order'}
                </button>
              </>
            )}
            {order.status === 'in_progress' && (
              <button style={S.completeBtn} disabled={actionLoading} onClick={() => handleAction('complete')}>
                {actionLoading ? 'Processing...' : '✔ Mark as Complete'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
