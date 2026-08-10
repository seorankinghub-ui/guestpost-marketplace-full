// @ts-nocheck
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const categoriesList = [
  'Technology', 'Health', 'Finance', 'Business', 'Travel',
  'Lifestyle', 'Education', 'Real Estate', 'Fashion', 'Crypto', 'SaaS',
];

const S = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 20 },
  form: { maxWidth: 680, backgroundColor: '#fff', borderRadius: 10, padding: 28, border: '1px solid #e2e8f0' },
  field: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#2d3748', boxSizing: 'border-box' as const },
  select: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#2d3748', backgroundColor: '#fff', boxSizing: 'border-box' as const },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#2d3748', minHeight: 80, resize: 'vertical' as const, boxSizing: 'border-box' as const },
  row: { display: 'flex', gap: 16 },
  half: { flex: 1 },
  categories: { display: 'flex', flexWrap: 'wrap' as const, gap: 8 },
  catChip: (sel: boolean) => ({
    padding: '6px 14px',
    borderRadius: 20,
    border: `1px solid ${sel ? '#3182ce' : '#e2e8f0'}`,
    backgroundColor: sel ? '#ebf8ff' : '#fff',
    color: sel ? '#2b6cb0' : '#718096',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  }),
  submitBtn: { padding: '12px 28px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  error: { padding: '10px 16px', backgroundColor: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 6, color: '#c53030', fontSize: 13, marginBottom: 16 },
};

export default function AddSite() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [language, setLanguage] = useState('English');
  const [country, setCountry] = useState('US');
  const [categories, setCategories] = useState<string[]>([]);
  const [contentPrice, setContentPrice] = useState('50');
  const [writingPrice, setWritingPrice] = useState('65');
  const [requirements, setRequirements] = useState('');
  const [minWords, setMinWords] = useState('500');
  const [maxLinks, setMaxLinks] = useState('2');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleCat(cat: string) {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!domain.trim()) { setError('Domain is required.'); return; }
    if (categories.length === 0) { setError('Select at least one category.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domain.trim(),
          language,
          country,
          categories: JSON.stringify(categories),
          content_placement_price: parseFloat(contentPrice) || 50,
          writing_placement_price: parseFloat(writingPrice) || 65,
          site_requirements: requirements,
          min_words: parseInt(minWords) || 500,
          max_links_per_article: parseInt(maxLinks) || 2,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to add site');
      }
      router.push('/sites');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={S.pageTitle}>Add New Site</h1>

      <form style={S.form} onSubmit={handleSubmit}>
        {error && <div style={S.error}>{error}</div>}

        <div style={S.field}>
          <label style={S.label}>Domain</label>
          <input style={S.input} value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. yoursite.com" />
        </div>

        <div style={S.row}>
          <div style={{ ...S.field, ...S.half }}>
            <label style={S.label}>Language</label>
            <select style={S.select} value={language} onChange={e => setLanguage(e.target.value)}>
              <option>English</option><option>Spanish</option><option>French</option><option>German</option><option>Portuguese</option>
            </select>
          </div>
          <div style={{ ...S.field, ...S.half }}>
            <label style={S.label}>Country</label>
            <select style={S.select} value={country} onChange={e => setCountry(e.target.value)}>
              <option value="US">United States</option><option value="GB">United Kingdom</option><option value="CA">Canada</option><option value="AU">Australia</option><option value="DE">Germany</option>
            </select>
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Categories</label>
          <div style={S.categories}>
            {categoriesList.map(cat => (
              <div key={cat} style={S.catChip(categories.includes(cat))} onClick={() => toggleCat(cat)}>
                {cat}
              </div>
            ))}
          </div>
        </div>

        <div style={S.row}>
          <div style={{ ...S.field, ...S.half }}>
            <label style={S.label}>Content Placement Price ($)</label>
            <input style={S.input} type="number" value={contentPrice} onChange={e => setContentPrice(e.target.value)} min="0" step="0.01" />
          </div>
          <div style={{ ...S.field, ...S.half }}>
            <label style={S.label}>Writing & Placement Price ($)</label>
            <input style={S.input} type="number" value={writingPrice} onChange={e => setWritingPrice(e.target.value)} min="0" step="0.01" />
          </div>
        </div>

        <div style={S.row}>
          <div style={{ ...S.field, ...S.half }}>
            <label style={S.label}>Min Words</label>
            <input style={S.input} type="number" value={minWords} onChange={e => setMinWords(e.target.value)} min="100" />
          </div>
          <div style={{ ...S.field, ...S.half }}>
            <label style={S.label}>Max Links Per Article</label>
            <input style={S.input} type="number" value={maxLinks} onChange={e => setMaxLinks(e.target.value)} min="1" max="5" />
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Site Requirements</label>
          <textarea style={S.textarea} value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="Any special requirements for content on this site..." />
        </div>

        <button type="submit" style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? 'Submitting...' : 'Add Site'}
        </button>
      </form>
    </div>
  );
}
