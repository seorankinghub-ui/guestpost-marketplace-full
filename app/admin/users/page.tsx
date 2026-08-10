// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';

const S: any = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 20 },
  filters: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' as const },
  search: { padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, width: 240, boxSizing: 'border-box' as const },
  filterSelect: { padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, backgroundColor: '#fff', boxSizing: 'border-box' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' },
  th: { textAlign: 'left' as const, padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#718096', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f7fafc' },
  td: { padding: '12px 16px', fontSize: 13, color: '#4a5568', borderBottom: '1px solid #edf2f7' },
  badge: (color: string): React.CSSProperties => ({
    display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
    backgroundColor: `${color}20`, color,
  }),
  actionBtn: (color: string): React.CSSProperties => ({
    padding: '5px 12px', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: 'pointer',
    backgroundColor: `${color}15`, color, marginRight: 6,
  }),
  pagination: { display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 },
  pageBtn: (active: boolean): React.CSSProperties => ({
    padding: '7px 14px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13, fontWeight: 600,
    backgroundColor: active ? '#3182ce' : '#fff', color: active ? '#fff' : '#4a5568', cursor: 'pointer',
  }),
  modal: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalBox: { backgroundColor: '#fff', borderRadius: 12, padding: 28, width: 400, maxWidth: '90%' },
  modalTitle: { fontSize: 18, fontWeight: 600, color: '#2d3748', marginBottom: 16 },
};

const roleColors: Record<string, string> = {
  admin: '#e53e3e',
  publisher: '#3182ce',
  buyer: '#38a169',
};

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  balance_main: number;
  created_at: string;
  status?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ user: User } | null>(null);

  const perPage = 10;

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {} finally { setLoading(false); }
  }

  async function updateRole(userId: number, newRole: string) {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers();
    } catch {}
  }

  async function suspendUser(userId: number) {
    if (!confirm('Suspend this user?')) return;
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'suspended' }),
      });
      fetchUsers();
    } catch {}
  }

  const filtered = users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <h1 style={S.pageTitle}>Users</h1>

      <div style={S.filters}>
        <input style={S.search} placeholder="Search by email or name..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select style={S.filterSelect} value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="all">All Roles</option>
          <option value="buyer">Buyer</option>
          <option value="publisher">Publisher</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div style={{ color: '#718096', padding: 20 }}>Loading...</div>
      ) : (
        <>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>ID</th>
                <th style={S.th}>Name</th>
                <th style={S.th}>Email</th>
                <th style={S.th}>Role</th>
                <th style={S.th}>Balance</th>
                <th style={S.th}>Joined</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(u => (
                <tr key={u.id}>
                  <td style={S.td}>#{u.id}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{u.name}</td>
                  <td style={S.td}>{u.email}</td>
                  <td style={S.td}>
                    <span style={S.badge(roleColors[u.role])}>{u.role}</span>
                  </td>
                  <td style={{ ...S.td, fontWeight: 600 }}>${Number(u.balance_main).toFixed(2)}</td>
                  <td style={S.td}>{new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={S.td}>
                    <button style={S.actionBtn('#3182ce')} onClick={() => setModal({ user: u })}>Edit Role</button>
                    <button style={S.actionBtn('#e53e3e')} onClick={() => suspendUser(u.id)}>Suspend</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={S.pagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} style={S.pageBtn(page === i + 1)} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {modal && (
        <div style={S.modal} onClick={() => setModal(null)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>Edit Role: {modal.user.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['buyer', 'publisher', 'admin'].map(role => (
                <button
                  key={role}
                  style={{
                    padding: '10px 16px',
                    border: `2px solid ${modal.user.role === role ? '#3182ce' : '#e2e8f0'}`,
                    borderRadius: 8,
                    backgroundColor: modal.user.role === role ? '#ebf8ff' : '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#2d3748',
                  }}
                  onClick={() => { updateRole(modal.user.id, role); setModal(null); }}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
              <button style={{ padding: '10px 16px', backgroundColor: '#edf2f7', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#4a5568' }} onClick={() => setModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
