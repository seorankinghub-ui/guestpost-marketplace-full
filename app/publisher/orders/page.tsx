// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const statusTabs = [
  { key: 'acceptance', label: 'Pending Acceptance' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'approval', label: 'Pending Approval' },
  { key: 'completed', label: 'Completed' },
  { key: 'rejected', label: 'Rejected' },
];

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

const S: any = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 20 },
  tabs: { display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' as const },
  tab: (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: active ? '#3182ce' : '#edf2f7',
    color: active ? '#fff' : '#4a5568',
  }),
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0', marginBottom: 12 },
  cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 },
  orderInfo: { flex: 1 },
  orderId: { fontSize: 12, color: '#a0aec0', marginBottom: 2 },
  buyerName: { fontSize: 15, fontWeight: 600, color: '#2d3748' },
  orderMeta: { fontSize: 13, color: '#718096', marginTop: 2 },
  price: { fontSize: 18, fontWeight: 700, color: '#38a169', marginRight: 16 },
  actions: { display: 'flex', gap: 8 },
  acceptBtn: { padding: '7px 16px', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  rejectBtn: { padding: '7px 16px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  completeBtn: { padding: '7px 16px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  viewBtn: { padding: '7px 16px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' },
  badge: (color: string): React.CSSProperties => ({
    display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
    backgroundColor: `${color}20`, color,
  }),
  empty: { textAlign: 'center' as const, padding: 60, color: '#a0aec0', fontSize: 15 },
};

interface Order {
  id: number;
  buyer_name: string;
  site_domain: string;
  product_type: string;
  price: number;
  status: string;
  created_at: string;
}

export default function PublisherOrders() {
  const [activeTab, setActiveTab] = useState('acceptance');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, [activeTab]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?role=publisher&status=${activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }

  async function handleAction(orderId: number, action: 'accept' | 'reject' | 'complete') {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) fetchOrders();
    } catch {}
  }

  return (
    <div>
      <h1 style={S.pageTitle}>Orders</h1>
      <div style={S.tabs}>
        {statusTabs.map(tab => (
          <button key={tab.key} style={S.tab(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#718096', padding: 20 }}>Loading...</div>
      ) : orders.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>No orders in this category.</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={S.card}>
            <div style={S.cardRow}>
              <div style={S.orderInfo}>
                <div style={S.orderId}>Order #{order.id}</div>
                <div style={S.buyerName}>{order.buyer_name}</div>
                <div style={S.orderMeta}>
                  {order.site_domain} · {order.product_type.replace(/_/g, ' ')} · {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={S.badge(statusColors[order.status] || '#718096')}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                <span style={S.price}>${Number(order.price).toFixed(2)}</span>
                <div style={S.actions}>
                  {order.status === 'acceptance' && (
                    <>
                      <button style={S.acceptBtn} onClick={() => handleAction(order.id, 'accept')}>Accept</button>
                      <button style={S.rejectBtn} onClick={() => handleAction(order.id, 'reject')}>Reject</button>
                    </>
                  )}
                  {order.status === 'in_progress' && (
                    <button style={S.completeBtn} onClick={() => handleAction(order.id, 'complete')}>Mark Complete</button>
                  )}
                  <Link href={`/orders/${order.id}`} style={S.viewBtn}>View</Link>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
