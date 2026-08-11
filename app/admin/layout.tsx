export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import Link from 'next/link';
import { getSession } from '@/lib/auth';

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' },
  sidebar: {
    width: 250,
    backgroundColor: '#1a202c',
    display: 'flex', flexDirection: 'column' as const,
    padding: '24px 0', flexShrink: 0,
  },
  logo: { padding: '0 24px 24px', borderBottom: '1px solid #2d3748', marginBottom: 20 },
  logoText: { fontSize: 20, fontWeight: 700, color: '#fff' },
  logoSub: { fontSize: 11, color: '#a0aec0', marginTop: 2 },
  navList: { listStyle: 'none', padding: 0, margin: 0, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 24px', fontSize: 14, color: '#a0aec0', textDecoration: 'none',
    transition: 'all 0.15s', borderLeft: '3px solid transparent',
  },
  navIcon: { fontSize: 17, width: 22, textAlign: 'center' as const },
  bottomSection: { borderTop: '1px solid #2d3748', padding: '16px 24px 0' },
  userSection: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    backgroundColor: '#e53e3e', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#e2e8f0' },
  userRole: { fontSize: 11, color: '#718096' },
  logoutLink: { fontSize: 12, color: '#fc8181', textDecoration: 'none', marginLeft: 'auto' },
  main: { flex: 1, padding: '32px 40px', overflowY: 'auto' as const, maxHeight: '100vh' },
};

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/sites', label: 'Sites', icon: '🌐' },
  { href: '/admin/orders', label: 'Orders', icon: '📋' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('session_token')?.value;
  const session = token ? getSession(token) : null;

  if (!session || session.role !== 'admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center', background: '#f5f6fa' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>Admin Access Required</h1>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Please log in with an admin account.</p>
        <a href="/login" style={{ background: '#2563eb', color: 'white', padding: '.75rem 2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Go to Login</a>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>GuestPost</div>
          <div style={styles.logoSub}>Admin Panel</div>
        </div>
        <nav>
          <ul style={styles.navList}>
            {navItems.map(item => (
              <li key={item.href}>
                <Link href={item.href} style={styles.navItem} prefetch={false}>
                  <span style={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div style={styles.bottomSection}>
          <div style={styles.userSection}>
            <div style={styles.avatar}>AD</div>
            <div>
              <div style={styles.userName}>{session.name}</div>
              <div style={styles.userRole}>Administrator</div>
            </div>
            <a href="/api/auth/logout" style={styles.logoutLink}>Logout</a>
          </div>
        </div>
      </aside>
      <main style={styles.main}>{children}</main>
    </div>
  );
}
