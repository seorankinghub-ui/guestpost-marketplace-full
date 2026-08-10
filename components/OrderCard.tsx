'use client';

import Link from 'next/link';

interface OrderCardProps {
  order: {
    id: number;
    site_domain: string;
    site_url?: string;
    product_type: string;
    status: string;
    price: number;
    created_at: string;
    publisher_name?: string;
  };
  children?: React.ReactNode;
}

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

const productTypeLabels: Record<string, string> = {
  content_placement: 'Content Placement',
  writing_placement: 'Writing & Placement',
  link_insertion: 'Link Insertion',
};

const formatDate = (d: string) => new Date(d + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatPrice = (p: number) => `$${p.toFixed(2)}`;

export default function OrderCard({ order, children }: OrderCardProps) {
  const color = statusColors[order.status] || '#94a3b8';
  const label = statusLabels[order.status] || order.status;
  const pLabel = productTypeLabels[order.product_type] || order.product_type;

  return (
    <div style={{
      background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
      padding: '1.25rem', transition: 'box-shadow .15s'
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,.06)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.75rem' }}>
        {/* Left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 200 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
              <Link href={`/orders/${order.id}`} style={{
                fontWeight: 700, fontSize: '1rem', color: '#1e293b', textDecoration: 'none'
              }}>
                #{order.id}
              </Link>
              <span style={{ color: '#94a3b8' }}>·</span>
              <span style={{ fontWeight: 600, fontSize: '.9rem', color: '#334155' }}>
                {order.site_domain}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                padding: '.15rem .55rem', background: '#f1f5f9', color: '#475569',
                borderRadius: 8, fontSize: '.7rem', fontWeight: 500
              }}>
                {pLabel}
              </span>
              <span style={{ fontSize: '.75rem', color: '#94a3b8' }}>
                {formatDate(order.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Middle - Status */}
        <span style={{
          padding: '.25rem .75rem', borderRadius: 12, fontSize: '.75rem', fontWeight: 600,
          background: color + '18', color: color
        }}>
          {label}
        </span>

        {/* Right side */}
        <div style={{ textAlign: 'right', minWidth: 80 }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>{formatPrice(order.price)}</div>
          <div style={{ display: 'flex', gap: '.5rem', marginTop: '.35rem' }}>
            <Link href={`/orders/${order.id}`} style={{
              fontSize: '.75rem', color: '#2563eb', textDecoration: 'none', fontWeight: 500
            }}>
              View
            </Link>
            {['draft', 'task_review'].includes(order.status) && (
              <Link href={`/orders/${order.id}`} style={{
                fontSize: '.75rem', color: '#ef4444', textDecoration: 'none', fontWeight: 500
              }}>
                Cancel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Additional actions slot */}
      {children && (
        <div style={{ marginTop: '.75rem', paddingTop: '.75rem', borderTop: '1px solid #f1f5f9' }}>
          {children}
        </div>
      )}
    </div>
  );
}
