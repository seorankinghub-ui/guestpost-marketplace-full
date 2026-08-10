import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';
import OrderDetailClient from './OrderDetailClient';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const token = cookies().get('session_token')?.value;
  const user = token ? getSession(token) : null;
  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please log in</div>;

  const db = getDb();
  const order = db.prepare(`
    SELECT o.*, s.domain as site_domain, s.url as site_url,
           s.moz_da, s.ahrefs_dr, s.organic_traffic, s.categories,
           u.name as publisher_name
    FROM orders o
    JOIN sites s ON o.site_id = s.id
    LEFT JOIN users u ON o.publisher_id = u.id
    WHERE o.id = ? AND o.buyer_id = ?
  `).get(params.id, user.id) as any;

  if (!order) return <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>Order not found</div>;

  const reviews = db.prepare(`
    SELECT r.*, u.name as reviewer_name FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.site_id = ?
    ORDER BY r.created_at DESC LIMIT 10
  `).all(order.site_id) as any[];

  const balance = db.prepare('SELECT balance_main FROM users WHERE id = ?').get(user.id) as any;

  return (
    <OrderDetailClient
      order={JSON.parse(JSON.stringify(order))}
      reviews={JSON.parse(JSON.stringify(reviews))}
      balance={balance.balance_main}
    />
  );
}
