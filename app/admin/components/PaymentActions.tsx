'use client';

import { useState } from 'react';

interface Order {
  id: number;
  buyer: string;
  site: string;
  publisher: string;
  type: string;
  price: number;
  status: string;
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  created_at: string;
}

interface Props {
  order: Order;
  onAction: (orderId: number, action: 'refund' | 'pay_publisher' | 'mark_paid', amount: number) => void;
}

const btnStyle = {
  padding: '6px 14px',
  borderRadius: 6,
  fontSize: '0.8rem',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  marginRight: 6,
  transition: 'all 0.15s',
};

export default function PaymentActions({ order, onAction }: Props) {
  const [showModal, setShowModal] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const platformFee = Math.round(order.price * 0.25); // 25% platform fee
  const publisherPayout = order.price - platformFee;

  const handleConfirm = () => {
    if (!showModal) return;
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      onAction(order.id, showModal as 'refund' | 'pay_publisher' | 'mark_paid', order.price);
      setProcessing(false);
      setShowModal(null);
      setDone(true);
    }, 800);
  };

  const closeModal = () => setShowModal(null);

  const canRefund = !done && order.paymentStatus !== 'refunded';
  const canPayPublisher = !done && order.paymentStatus !== 'paid' && (order.status === 'completed' || order.status === 'acceptance');
  const isPaid = order.paymentStatus === 'paid';

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {isPaid ? (
        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 12, background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 600 }}>
          ✅ Paid
        </span>
      ) : done && order.paymentStatus === 'refunded' ? (
        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 12, background: '#fee2e2', color: '#991b1b', fontSize: '0.75rem', fontWeight: 600 }}>
          ↩️ Refunded
        </span>
      ) : (
        <>
          {canPayPublisher && (
            <button
              onClick={() => setShowModal('pay_publisher')}
              style={{ ...btnStyle, background: '#059669', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#047857')}
              onMouseLeave={e => (e.currentTarget.style.background = '#059669')}
            >
              💰 Pay Publisher
            </button>
          )}
          {canRefund && (
            <button
              onClick={() => setShowModal('refund')}
              style={{ ...btnStyle, background: '#ef4444', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#dc2626')}
              onMouseLeave={e => (e.currentTarget.style.background = '#ef4444')}
            >
              ↩️ Refund
            </button>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem',
        }}>
          <div style={{
            background: 'white', borderRadius: 12, padding: '2rem',
            maxWidth: 420, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 700 }}>
              {showModal === 'refund' ? 'Confirm Refund' : 'Confirm Publisher Payment'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
              {showModal === 'refund'
                ? `Are you sure you want to refund $${order.price} to ${order.buyer}? This action cannot be undone.`
                : `Confirm payment of $${publisherPayout} to publisher ${order.publisher} for "${order.site}". Platform retains $${platformFee} (25% fee).`
              }
            </p>

            {showModal === 'pay_publisher' && (
              <div style={{
                background: '#f8fafc', borderRadius: 8, padding: '0.75rem 1rem',
                marginBottom: '1.5rem', fontSize: '0.85rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Order total:</span>
                  <span style={{ fontWeight: 600 }}>${order.price.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Platform fee (25%):</span>
                  <span style={{ color: '#ef4444' }}>-${platformFee.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ fontWeight: 600 }}>Publisher receives:</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>${publisherPayout.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                style={{ ...btnStyle, background: '#f1f5f9', color: '#475569' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={processing}
                style={{
                  ...btnStyle,
                  background: showModal === 'refund' ? '#ef4444' : '#059669',
                  color: '#fff',
                  opacity: processing ? 0.6 : 1,
                }}
              >
                {processing ? 'Processing...' : showModal === 'refund' ? 'Yes, Refund' : 'Yes, Pay Publisher'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
