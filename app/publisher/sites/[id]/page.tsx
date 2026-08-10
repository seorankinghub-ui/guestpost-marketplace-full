// @ts-nocheck
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

const categoriesList = [
  'Technology', 'Health', 'Finance', 'Business', 'Travel',
  'Lifestyle', 'Education', 'Real Estate', 'Fashion', 'Crypto', 'SaaS',
];

const S: any = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 4 },
  pageSub: { fontSize: 14, color: '#718096', marginBottom: 24 },
  form: { maxWidth: 680, backgroundColor: '#fff', borderRadius: 10, padding: 28, border: '1px solid #e2e8f0' },
  field: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#2d3748', boxSizing: 'border-box' as const },
  disabledInput: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#a0aec0', backgroundColor: '#f7fafc', boxSizing: 'border-box' as const },
  select: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#2d3748', backgroundColor: '#fff', boxSizing: 'border-box' as const },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#2d3748', minHeight: 80, resize: 'vertical' as const, boxSizing: 'border-box' as const },
  row: { display: 'flex', gap: 16 },
  half: { flex: 1 },
  categories: { display: 'flex', flexWrap: 'wrap' as const, gap: 8 },
  catChip: (sel: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: 20,
    border: `1px solid ${sel ? '#3182ce' : '#e2e8f0'}`,
    backgroundColor: sel ? '#ebf8ff' : '#fff',
    color: sel ? '#2b6cb0' : '#718096',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  }),
  radioGroup: { display: 'flex', gap: 16 },
  radio: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4a5568' },
  submitBtn: { padding: '12px 28px', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  success: { padding: '10px 16px', backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 6, color: '#22543d', fontSize: 13, marginBottom: 16 },
  error: { padding: '10px 16px', backgroundColor: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 6, color: '#c53030', fontSize: 13, marginBottom: 16 },
  statusSection: { marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 },
};

const statusColors: Record<string, string> = {
  approved: '#38a169',
  pending: '#d69e2e',
  rejected: '#e53e3e',
  suspended: '#718096',
};

export default function EditSite() {
  const router = useRouter();
  const params = useParams();
  const [domain, setDomain] = useState('');
  const [language, setLanguage] = useState('English');
  const [country, setCountry] = useState('US');
  const [categories, setCategories] = useState<string[]>([]);
  const [contentPrice, setContentPrice] = useState('50');
  const [writingPrice, setWritingPrice] = useState('65');
  const [requirements, setRequirements] = useState('');
  const [minWords, setMinWords] = useState('500');
  const [maxLinks, setMaxLinks] = useState('2');
  const [linkAttribution, setLinkAttribution] = useState('dofollow');
  const [sponsoredMarked, setSponsoredMarked] = useState('No');
  const [siteStatus, setSiteStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/sites/${params.id}`);
        if (!res.ok) throw new Error('Site not found');
        const data = await res.json();
        const s = data.site;
        setDomain(s.domain);
        setLanguage(s.language || 'English');
        setCountry(s.country || 'US');
        setCategories(s.categories ? JSON.parse(s.categories) : []);
        setContentPrice(String(s.content_placement_price || 50));
        setWritingPrice(String(s.writing_placement_price || 65));
        setRequirements(s.site_requirements || '');
        setMinWords(String(s.min_words || 500));
        setMaxLinks(String(s.max_links_per_article || 2));
        setLinkAttribution(s.link_attribution || 'dofollow');
        setSponsoredMarked(s.sponsored_marked || 'No');
        setSiteStatus(s.status);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [params.id]);

  function toggleCat(cat: string) {
    setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          country,
          categories: JSON.stringify(categories),
          content_placement_price: parseFloat(contentPrice) || 50,
          writing_placement_price: parseFloat(writingPrice) || 65,
          site_requirements: requirements,
          min_words: parseInt(minWords) || 500,
          max_links_per_article: parseInt(maxLinks) || 2,
          link_attribution: linkAttribution,
          sponsored_marked: sponsoredMarked,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update');
      }
      setSuccess('Site updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div style={{ padding: 40, color: '#718096' }}>Loading...</div>;
  if (error && !domain) return <div style={{ padding: 40, color: '#c53030' }}>{error}</div>;

  return (
    <div>
      <h1 style={S.pageTitle}>Edit Site</h1>
      <p style={S.pageSub}>{domain}</p>

      <form style={S.form} onSubmit={handleSubmit}>
        {success && <div style={S.success}>{success}</div>}
        {error && <div style={S.error}>{error}</div>}

        <div style={S.statusSection}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#4a5568' }}>Status:</span>
          <span style={{
            display: 'inline-block', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
            backgroundColor: `${statusColors[siteStatus]}20`, color: statusColors[siteStatus],
          }}>
            {siteStatus}
          </span>
        </div>

        <div style={S.field}>
          <label style={S.label}>Domain (read-only)</label>
          <input style={S.disabledInput} value={domain} disabled />
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

        <div style={S.row}>
          <div style={{ ...S.field, ...S.half }}>
            <label style={S.label}>Link Attribution</label>
            <div style={S.radioGroup}>
              <label style={S.radio}>
                <input type="radio" name="attribution" value="dofollow" checked={linkAttribution === 'dofollow'} onChange={() => setLinkAttribution('dofollow')} />
                Dofollow
              </label>
              <label style={S.radio}>
                <input type="radio" name="attribution" value="nofollow" checked={linkAttribution === 'nofollow'} onChange={() => setLinkAttribution('nofollow')} />
                Nofollow
              </label>
            </div>
          </div>
          <div style={{ ...S.field, ...S.half }}>
            <label style={S.label}>Sponsored Marking</label>
            <select style={S.select} value={sponsoredMarked} onChange={e => setSponsoredMarked(e.target.value)}>
              <option>No</option><option>Yes</option>
            </select>
          </div>
        </div>

        <div style={S.field}>
          <label style={S.label}>Site Requirements</label>
          <textarea style={S.textarea} value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="Any special requirements for content on this site..." />
        </div>

        <button type="submit" style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
