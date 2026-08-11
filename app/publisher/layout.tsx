export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import Link from 'next/link';
import { getSession } from '@/lib/auth';

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
  { href: '/publisher/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/publisher/sites', label: 'My Sites', icon: '🌐' },
  { href: '/publisher/orders', label: 'Orders', icon: '📋' },
  { href: '/publisher/earnings', label: 'Earnings', icon: '💰' },
  { href: '/publisher/settings', label: 'Settings', icon: '⚙️' },
];

export default async function PublisherLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('session_token')?.value;
  const session = token ? getSession(token) : null;

  if (!session || session.role !== 'publisher') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center', background: '#f5f6fa' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>Publisher Access Required</h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Please log in with a publisher account.</p>
        <a href="/login" style={{ background: '#2563eb', color: 'white', padding: '.75rem 2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Go to Login</a>
      </div>
    );
  }

  const totalEarned = 307;
  const pendingOrders = 2;
  const activeSites = 3;

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
            <div style={styles.balanceAmount}>${(totalEarned).toFixed(2)}</div>
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
