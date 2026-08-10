// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';

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

function badgeStyle(color: string): React.CSSProperties {
  return { display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: `${color}20`, color };
}

const S = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 20 } as React.CSSProperties,
  filters: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' } as React.CSSProperties,
  filterSelect: { padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, backgroundColor: '#fff' } as React.CSSProperties,
  table: { width: '100%', borderCollapse: 'collapse' as const, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' } as React.CSSProperties,
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f7fafc' } as React.CSSProperties,
  td: { padding: '12px 16px', fontSize: 13, color: '#4a5568', borderBottom: '1px solid #edf2f7' } as React.CSSProperties,
  viewBtn: { padding: '5px 12px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
  modal: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 } as React.CSSProperties,
  modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 28, width: 540, maxWidth: '92%', maxHeight: '80vh', overflowY: 'auto' as const } as React.CSSProperties,
  modalTitle: { fontSize: 18, fontWeight: 600, color: '#2d3748', marginBottom: 16 } as React.CSSProperties,
  detailRow: { display: 'flex', gap: 20, marginBottom: 14, flexWrap: 'wrap' as const } as React.CSSProperties,
  detailCol: { flex: '1 1 150px' } as React.CSSProperties,
  detailLabel: { fontSize: 11, color: '#a0aec0', textTransform: 'uppercase' as const, fontWeight: 600, letterSpacing: '0.5px', marginBottom: 2 } as React.CSSProperties,
  detailValue: { fontSize: 14, color: '#2d3748', fontWeight: 500 } as React.CSSProperties,
  contentBox: { padding: 14, backgroundColor: '#f7fafc', borderRadius: 6, fontSize: 13, color: '#4a5568', lineHeight: 1.6, whiteSpace: 'pre-wrap' as const, marginTop: 12 } as React.CSSProperties,
};

interface Order {
  id: number;
  buyer_name: string;
  buyer_email: string;
  publisher_name: string | null;
  site_domain: string;
  product_type: string;
  price: number;
  status: string;
  promoted_url: string;
  anchor_text: string;
  content: string;
  special_requirements: string;
  created_at: string;
  updated_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const qs = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/admin/orders${qs}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {} finally { setLoading(false); }
  }

  async function viewOrder(id: number) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
      }
    } catch {} finally { setDetailLoading(false); }
  }

  return (
    <div>
      <h1 style={S.pageTitle}>Orders</h1>

      <div style={S.filters}>
        <select style={S.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="task_review">Task Review</option>
          <option value="acceptance">Acceptance</option>
          <option value="in_progress">In Progress</option>
          <option value="approval">Approval</option>
          <option value="improvement">Improvement</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div style={{ color: '#718096', padding: 20 }}>Loading...</div>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Order ID</th>
              <th style={S.th}>Buyer</th>
              <th style={S.th}>Publisher</th>
              <th style={S.th}>Site</th>
              <th style={S.th}>Type</th>
              <th style={S.th}>Price</th>
              <th style={S.th}>Status</th>
              <th style={S.th}>Date</th>
              <th style={S.th}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ ...S.td, fontWeight: 600 }}>#{o.id}</td>
                <td style={S.td}>{o.buyer_name}</td>
                <td style={S.td}>{o.publisher_name || '-'}</td>
                <td style={S.td}>{o.site_domain || '-'}</td>
                <td style={S.td}>{o.product_type.replace(/_/g, ' ')}</td>
                <td style={{ ...S.td, fontWeight: 600, color: '#38a169' }}>${Number(o.price).toFixed(2)}</td>
                <td style={S.td}>
                  <span style={badgeStyle(statusColors[o.status] || '#718096')}>
                    {o.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={S.td}>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td style={S.td}>
                  <button style={S.viewBtn} onClick={() => viewOrder(o.id)}>View</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td style={{ ...S.td, textAlign: 'center', color: '#a0aec0' }} colSpan={9}>No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div style={S.modal} onClick={() => setSelectedOrder(null)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={S.modalTitle}>Order #{selectedOrder.id}</div>
              <span style={badgeStyle(statusColors[selectedOrder.status] || '#718096')}>
                {selectedOrder.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div style={S.detailRow}>
              <div style={S.detailCol}>
                <div style={S.detailLabel}>Buyer</div>
                <div style={S.detailValue}>{selectedOrder.buyer_name}</div>
                <div style={{ fontSize: 12, color: '#a0aec0' }}>{selectedOrder.buyer_email}</div>
              </div>
              <div style={S.detailCol}>
                <div style={S.detailLabel}>Publisher</div>
                <div style={S.detailValue}>{selectedOrder.publisher_name || 'Unassigned'}</div>
              </div>
              <div style={S.detailCol}>
                <div style={S.detailLabel}>Site</div>
                <div style={S.detailValue}>{selectedOrder.site_domain || '-'}</div>
              </div>
            </div>

            <div style={S.detailRow}>
              <div style={S.detailCol}>
                <div style={S.detailLabel}>Type</div>
                <div style={S.detailValue}>{selectedOrder.product_type.replace(/_/g, ' ')}</div>
              </div>
              <div style={S.detailCol}>
                <div style={S.detailLabel}>Price</div>
                <div style={{ ...S.detailValue, color: '#38a169', fontWeight: 700, fontSize: 18 }}>${Number(selectedOrder.price).toFixed(2)}</div>
              </div>
              <div style={S.detailCol}>
                <div style={S.detailLabel}>Date</div>
                <div style={S.detailValue}>{new Date(selectedOrder.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>

            {(selectedOrder.promoted_url || selectedOrder.anchor_text) && (
              <div style={S.detailRow}>
                {selectedOrder.promoted_url && (
                  <div style={S.detailCol}>
                    <div style={S.detailLabel}>Promoted URL</div>
                    <div style={{ ...S.detailValue, color: '#3182ce', wordBreak: 'break-all' }}>{selectedOrder.promoted_url}</div>
                  </div>
                )}
                {selectedOrder.anchor_text && (
                  <div style={S.detailCol}>
                    <div style={S.detailLabel}>Anchor Text</div>
                    <div style={S.detailValue}>{selectedOrder.anchor_text}</div>
                  </div>
                )}
              </div>
            )}

            {selectedOrder.special_requirements && (
              <div style={{ marginBottom: 14 }}>
                <div style={S.detailLabel}>Special Requirements</div>
                <div style={{ ...S.detailValue, marginTop: 4 }}>{selectedOrder.special_requirements}</div>
              </div>
            )}

            {selectedOrder.content && (
              <div style={S.contentBox}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#718096', marginBottom: 6 }}>CONTENT</div>
                {selectedOrder.content}
              </div>
            )}

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button
                style={{ padding: '8px 20px', backgroundColor: '#edf2f7', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#4a5568', cursor: 'pointer' }}
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
