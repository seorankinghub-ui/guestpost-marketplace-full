export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f6fa',
  },
  sidebar: {
    width: 260,
    backgroundColor: '#fff',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '24px 0',
    flexShrink: 0,
  },
  logo: {
    padding: '0 24px 24px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a202c',
  },
  logoSub: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 24px',
    fontSize: 14,
    color: '#4a5568',
    textDecoration: 'none',
    transition: 'background 0.15s',
    borderLeft: '3px solid transparent',
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 24px',
    fontSize: 14,
    color: '#2b6cb0',
    textDecoration: 'none',
    fontWeight: 600,
    backgroundColor: '#ebf8ff',
    borderLeft: '3px solid #2b6cb0',
  },
  navIcon: {
    fontSize: 18,
    width: 22,
    textAlign: 'center' as const,
  },
  bottomSection: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: 16,
    marginTop: 16,
  },
  balanceCard: {
    margin: '0 16px',
    padding: 16,
    backgroundColor: '#f0fff4',
    borderRadius: 8,
    border: '1px solid #c6f6d5',
  },
  balanceLabel: {
    fontSize: 11,
    color: '#38a169',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: 700,
    color: '#22543d',
    marginTop: 2,
  },
  userSection: {
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#3182ce',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#2d3748',
  },
  userRole: {
    fontSize: 11,
    color: '#a0aec0',
  },
  logoutLink: {
    fontSize: 12,
    color: '#e53e3e',
    textDecoration: 'none',
    marginLeft: 'auto',
  },
  main: {
    flex: 1,
    padding: '32px 40px',
    overflowY: 'auto' as const,
    maxHeight: '100vh',
  },
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/sites', label: 'My Sites', icon: '🌐' },
  { href: '/orders', label: 'Orders', icon: '📋' },
  { href: '/earnings', label: 'Earnings', icon: '💰' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default async function PublisherLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('session_token')?.value;
  if (!token) redirect('/login');

  const session = getSession(token);
  if (!session || session.role !== 'publisher') redirect('/login');

  const db = getDb();
  const totalEarned = db.prepare(`
    SELECT COALESCE(SUM(wt.amount), 0) as total
    FROM wallet_transactions wt
    JOIN orders o ON wt.order_id = o.id
    WHERE wt.user_id = ? AND wt.balance_type = 'main' AND wt.type = 'release'
  `).get(session.id) as any;

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>GuestPost</div>
          <div style={styles.logoSub}>Publisher Portal</div>
        </div>
        <nav>
          <ul style={styles.navList}>
            {navItems.map((item) => {
              const active = typeof children !== 'undefined'; // simplified — full active detection via pathname in client
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={styles.navItem}
                    prefetch={false}
                  >
                    <span style={styles.navIcon}>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div style={styles.bottomSection}>
          <div style={styles.balanceCard}>
            <div style={styles.balanceLabel}>Total Earned</div>
            <div style={styles.balanceAmount}>${((totalEarned?.total || 0)).toFixed(2)}</div>
          </div>
          <div style={styles.userSection}>
            <div style={styles.avatar}>
              {session.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <div style={styles.userName}>{session.name}</div>
              <div style={styles.userRole}>Publisher</div>
            </div>
            <a href="/api/auth/logout" style={styles.logoutLink}>Logout</a>
          </div>
        </div>
      </aside>
      <main style={styles.main}>{children}</main>
    </div>
  );
}
