// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const S = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 4 },
  pageSub: { fontSize: 14, color: '#718096', marginBottom: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' as const, gap: 12 },
  addBtn: { padding: '10px 22px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  domain: { fontSize: 16, fontWeight: 600, color: '#2b6cb0' },
  badge: (color: string) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: `${color}20`,
    color,
  }),
  metrics: { display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' as const },
  metric: { fontSize: 12, color: '#718096' },
  metricVal: { fontWeight: 600, color: '#2d3748' },
  prices: { display: 'flex', gap: 16, marginBottom: 12, fontSize: 13, color: '#4a5568' },
  priceVal: { fontWeight: 600, color: '#38a169' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #edf2f7' },
  completionRate: { fontSize: 12, color: '#718096' },
  editBtn: { padding: '6px 14px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' },
  empty: { textAlign: 'center' as const, padding: 60, color: '#a0aec0', fontSize: 15 },
};

const statusColors: Record<string, string> = {
  approved: '#38a169',
  pending: '#d69e2e',
  rejected: '#e53e3e',
  suspended: '#718096',
};

interface Site {
  id: number;
  domain: string;
  language: string;
  country: string;
  categories: string;
  moz_da: number;
  ahrefs_dr: number;
  organic_traffic: number;
  completion_rate: number;
  tat_days: number;
  content_placement_price: number;
  writing_placement_price: number;
  status: string;
  created_at: string;
  is_owner: number;
}

export default function PublisherSites() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    try {
      const res = await fetch('/api/sites?my=true');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSites(data.sites || []);
    } catch {
      setSites([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: 40, color: '#718096' }}>Loading...</div>;

  return (
    <div>
      <div style={S.header}>
        <div>
          <h1 style={S.pageTitle}>My Sites</h1>
          <p style={S.pageSub}>Manage your marketplace sites and inventory.</p>
        </div>
        <Link href="/sites/add" style={S.addBtn}>+ Add Site</Link>
      </div>

      {sites.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌐</div>
          <p>You haven&apos;t added any sites yet.</p>
          <Link href="/sites/add" style={{ color: '#3182ce', fontWeight: 600 }}>Add your first site →</Link>
        </div>
      ) : (
        <div style={S.grid}>
          {sites.map((site: Site) => (
            <div key={site.id} style={S.card}>
              <div style={S.cardHeader}>
                <div style={S.domain}>{site.domain}</div>
                <span style={S.badge(statusColors[site.status] || '#718096')}>
                  {site.status}
                </span>
              </div>
              <div style={S.metrics}>
                <div style={S.metric}>
                  DA <span style={S.metricVal}>{site.moz_da}</span>
                </div>
                <div style={S.metric}>
                  DR <span style={S.metricVal}>{site.ahrefs_dr}</span>
                </div>
                <div style={S.metric}>
                  Traffic <span style={S.metricVal}>{site.organic_traffic?.toLocaleString() || 0}</span>
                </div>
                <div style={S.metric}>
                  TAT <span style={S.metricVal}>{site.tat_days}d</span>
                </div>
              </div>
              <div style={S.prices}>
                <div>
                  Content: <span style={S.priceVal}>${Number(site.content_placement_price).toFixed(2)}</span>
                </div>
                <div>
                  Writing: <span style={S.priceVal}>${Number(site.writing_placement_price).toFixed(2)}</span>
                </div>
              </div>
              <div style={S.footer}>
                <div style={S.completionRate}>
                  Completion: {site.completion_rate}% | {site.language}, {site.country}
                </div>
                <Link href={`/sites/${site.id}`} style={S.editBtn}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
