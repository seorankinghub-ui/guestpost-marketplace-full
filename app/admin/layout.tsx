export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/users', label: 'Users', icon: '👥' },
  { href: '/sites', label: 'Sites', icon: '🌐' },
  { href: '/orders', label: 'Orders', icon: '📋' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('session_token')?.value;
  if (!token) redirect('/login');

  const session = getSession(token);
  if (!session || session.role !== 'admin') redirect('/login');

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
