// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';

const tabs = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

const statusColors: Record<string, string> = {
  approved: '#38a169',
  pending: '#d69e2e',
  rejected: '#e53e3e',
  suspended: '#718096',
};

const S: any = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 20 },
  tabs: { display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' as const },
  tab: (active: boolean): React.CSSProperties => ({
    padding: '8px 18px', fontSize: 13, fontWeight: 600, borderRadius: 6,
    border: 'none', cursor: 'pointer',
    backgroundColor: active ? '#3182ce' : '#edf2f7',
    color: active ? '#fff' : '#4a5568',
  }),
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  domain: { fontSize: 16, fontWeight: 600, color: '#2b6cb0' },
  badge: (color: string): React.CSSProperties => ({
    display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
    backgroundColor: `${color}20`, color,
  }),
  meta: { fontSize: 12, color: '#a0aec0', marginTop: 2 },
  metrics: { display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' as const },
  metric: { fontSize: 12, color: '#718096' },
  metricVal: { fontWeight: 600, color: '#2d3748' },
  prices: { display: 'flex', gap: 14, marginBottom: 12, fontSize: 13, color: '#4a5568' },
  categories: { display: 'flex', gap: 4, flexWrap: 'wrap' as const, marginBottom: 12 },
  catChip: { padding: '3px 8px', backgroundColor: '#edf2f7', borderRadius: 4, fontSize: 11, color: '#4a5568', fontWeight: 500 },
  actions: { display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #edf2f7' },
  approveBtn: { padding: '7px 18px', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  rejectBtn: { padding: '7px 18px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center' as const, padding: 60, color: '#a0aec0', fontSize: 15 },
};

interface Site {
  id: number;
  domain: string;
  categories: string;
  language: string;
  country: string;
  moz_da: number;
  ahrefs_dr: number;
  organic_traffic: number;
  content_placement_price: number;
  writing_placement_price: number;
  status: string;
  created_at: string;
  owner_name?: string;
}

export default function AdminSites() {
  const [activeTab, setActiveTab] = useState('pending');
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSites(); }, [activeTab]);

  async function fetchSites() {
    setLoading(true);
    try {
      const statusFilter = activeTab === 'all' ? '' : `&status=${activeTab}`;
      const res = await fetch(`/api/admin/sites?${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setSites(data.sites || []);
      }
    } catch {} finally { setLoading(false); }
  }

  async function moderate(siteId: number, action: 'approve' | 'reject') {
    try {
      await fetch(`/api/admin/sites/${siteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      fetchSites();
    } catch {}
  }

  return (
    <div>
      <h1 style={S.pageTitle}>Site Moderation</h1>

      <div style={S.tabs}>
        {tabs.map(tab => (
          <button key={tab.key} style={S.tab(activeTab === tab.key)} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#718096', padding: 20 }}>Loading...</div>
      ) : sites.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌐</div>
          <p>No sites in this category.</p>
        </div>
      ) : (
        <div style={S.grid}>
          {sites.map((site: Site) => {
            const cats = (() => { try { return JSON.parse(site.categories || '[]'); } catch { return []; } })();
            return (
              <div key={site.id} style={S.card}>
                <div style={S.cardHeader}>
                  <div>
                    <div style={S.domain}>{site.domain}</div>
                    <div style={S.meta}>Submitted {new Date(site.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <span style={S.badge(statusColors[site.status] || '#718096')}>{site.status}</span>
                </div>

                <div style={S.metrics}>
                  <div style={S.metric}>DA <span style={S.metricVal}>{site.moz_da}</span></div>
                  <div style={S.metric}>DR <span style={S.metricVal}>{site.ahrefs_dr}</span></div>
                  <div style={S.metric}>Traffic <span style={S.metricVal}>{(site.organic_traffic || 0).toLocaleString()}</span></div>
                  <div style={S.metric}>Lang <span style={S.metricVal}>{site.language}</span></div>
                </div>

                <div style={S.categories}>
                  {cats.map((cat: string) => <span key={cat} style={S.catChip}>{cat}</span>)}
                </div>

                <div style={S.prices}>
                  <span>Content: <strong>${Number(site.content_placement_price).toFixed(2)}</strong></span>
                  <span>Writing: <strong>${Number(site.writing_placement_price).toFixed(2)}</strong></span>
                </div>

                {site.status === 'pending' && (
                  <div style={S.actions}>
                    <button style={S.approveBtn} onClick={() => moderate(site.id, 'approve')}>✓ Approve</button>
                    <button style={S.rejectBtn} onClick={() => moderate(site.id, 'reject')}>✗ Reject</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
