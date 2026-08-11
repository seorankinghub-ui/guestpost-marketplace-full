export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('session_token')?.value;
  const user = token ? getSession(token) : null;
  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please log in</div>;

  const balance = user.balance_main || 0;

  const sidebarLinks = [
    { href: '/buyer/dashboard', label: '📊 Dashboard' },
    { href: '/buyer/catalog', label: '🔍 Browse Sites' },
    { href: '/buyer/orders', label: '📋 My Orders' },
    { href: '/buyer/wallet', label: '💰 Wallet' },
    { href: '/buyer/settings', label: '⚙️ Settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 240, background: '#f8fafc', borderRight: '1px solid #e2e8f0',
        padding: '1.5rem', display: 'flex', flexDirection: 'column', flexShrink: 0
      }}>
        <Link href="/" style={{
          fontSize: '1.25rem', fontWeight: 800, color: '#2563eb',
          textDecoration: 'none', display: 'block', marginBottom: '2rem'
        }}>
          GuestPost
        </Link>
        <div style={{
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: 'white', padding: '1rem', borderRadius: 8, marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '.75rem', opacity: .8 }}>Available Balance</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${balance.toFixed(2)}</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', flex: 1 }}>
          {sidebarLinks.map(link => {
            const isActive = typeof window === 'undefined' ? false : false;
            return (
              <Link key={link.href} href={link.href} style={{
                padding: '.6rem .75rem', borderRadius: 6, color: '#475569',
                textDecoration: 'none', fontWeight: 500, fontSize: '.9rem',
                transition: 'background .15s'
              }}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b' }}>{user.name}</div>
          <div style={{ fontSize: '.7rem', color: '#94a3b8', marginBottom: '.5rem' }}>{user.role}</div>
          <Link href="/api/auth/logout" style={{ fontSize: '.75rem', color: '#ef4444', textDecoration: 'none' }}>
            Log out
          </Link>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '2rem', background: '#ffffff', overflowX: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
