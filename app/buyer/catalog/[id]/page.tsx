'use client';

import { useEffect, useState } from 'react';

interface Site {
  id: number;
  domain: string;
  url: string;
  language: string;
  country: string;
  categories: string;
  moz_da: number;
  ahrefs_dr: number;
  organic_traffic: number;
  spam_score: number;
  completion_rate: number;
  avg_link_lifetime: number;
  tat_days: number;
  max_links_per_article: number;
  min_words: number;
  link_attribution: string;
  content_placement_price: number;
  writing_placement_price: number;
  verified_owner: number;
  avg_rating: number;
  review_count: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

const starRating = (rating: number) => '⭐'.repeat(Math.round(rating)) + (rating < 1 ? '☆'.repeat(5) : '☆'.repeat(5 - Math.round(rating)));

const formatDate = (d: string) => new Date(d + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function SiteDetailPage({ params }: { params: { id: string } }) {
  const [site, setSite] = useState<Site | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  // Form state
  const [productType, setProductType] = useState('content_placement');
  const [content, setContent] = useState('');
  const [promotedUrl, setPromotedUrl] = useState('');
  const [anchorText, setAnchorText] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    fetch(`/api/sites/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else { setSite(data.site); setReviews(data.reviews); }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load site'); setLoading(false); });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productType) return;

    if (productType !== 'link_insertion' && !content) {
      setSubmitMsg('Please provide content for your article.');
      return;
    }
    if (!promotedUrl) {
      setSubmitMsg('Please provide the URL to promote.');
      return;
    }

    setSubmitting(true);
    setSubmitMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: site?.id,
          product_type: productType,
          content: content || null,
          promoted_url: promotedUrl,
          anchor_text: anchorText || null,
          special_requirements: specialRequirements || null,
          project_name: projectName || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitMsg(data.error || 'Failed to create order');
      } else {
        setSubmitMsg('Order created successfully! Redirecting...');
        setTimeout(() => { window.location.href = `/orders/${data.order.id}`; }, 1500);
      }
    } catch {
      setSubmitMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading site details...</div>;
  if (error || !site) return <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error || 'Site not found'}</div>;

  const cats = (() => { try { return JSON.parse(site.categories); } catch { return []; } })();

  const price = productType === 'content_placement' ? site.content_placement_price
    : productType === 'writing_placement' ? site.writing_placement_price
    : site.content_placement_price * 0.8;

  const formatPrice = (p: number) => `$${p.toFixed(2)}`;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ fontSize: '.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <a href="/catalog" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Catalog</a>
      </div>

      {/* Site Header */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{site.domain}</h1>
              {site.verified_owner ? (
                <span style={{ color: '#2563eb', fontSize: '.85rem' }} title="Verified Owner">✓ Verified</span>
              ) : null}
            </div>
            <a href={site.url} target="_blank" rel="noreferrer" style={{ color: '#64748b', fontSize: '.85rem' }}>
              {site.url} ↗
            </a>
            <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem', flexWrap: 'wrap' }}>
              {cats.map((c: string) => (
                <span key={c} style={{ padding: '.15rem .6rem', background: '#eff6ff', color: '#2563eb', borderRadius: 12, fontSize: '.75rem', fontWeight: 500 }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '.85rem', color: '#f59e0b' }}>
              {starRating(site.avg_rating)} <span style={{ color: '#64748b' }}>({site.review_count} reviews)</span>
            </div>
            <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{site.language} · {site.country}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Metrics */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Site Metrics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Moz DA', value: site.moz_da, color: '#2563eb' },
              { label: 'Ahrefs DR', value: site.ahrefs_dr, color: '#10b981' },
              { label: 'Org. Traffic', value: site.organic_traffic.toLocaleString(), color: '#f59e0b' },
              { label: 'Spam Score', value: site.spam_score + '%', color: '#ef4444' },
              { label: 'Completion', value: site.completion_rate + '%', color: '#8b5cf6' },
              { label: 'Avg Link Life', value: site.avg_link_lifetime + '%', color: '#06b6d4' },
              { label: 'TAT', value: site.tat_days + ' days', color: '#f97316' },
              { label: 'Attribution', value: site.link_attribution, color: '#64748b' },
            ].map(m => (
              <div key={m.label} style={{ background: '#f8fafc', padding: '.75rem', borderRadius: 8 }}>
                <div style={{ fontSize: '.75rem', color: '#64748b', marginBottom: '.25rem' }}>{m.label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Pricing</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.95rem' }}>Content Placement</div>
                <div style={{ fontSize: '.75rem', color: '#64748b' }}>You provide the content</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{formatPrice(site.content_placement_price)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f0fdf4', borderRadius: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.95rem' }}>Writing & Placement</div>
                <div style={{ fontSize: '.75rem', color: '#64748b' }}>We write and place your content</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>{formatPrice(site.writing_placement_price)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.95rem' }}>Link Insertion</div>
                <div style={{ fontSize: '.75rem', color: '#64748b' }}>Insert link into existing content</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#64748b' }}>{formatPrice(site.content_placement_price * 0.8)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Form */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Place Order on {site.domain}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
              <label style={{ fontSize: '.85rem', fontWeight: 600, color: '#334155' }}>Product Type</label>
              <select value={productType} onChange={e => setProductType(e.target.value)} style={{
                padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem', background: 'white'
              }}>
                <option value="content_placement">Content Placement</option>
                <option value="writing_placement">Writing & Placement</option>
                <option value="link_insertion">Link Insertion</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
              <label style={{ fontSize: '.85rem', fontWeight: 600, color: '#334155' }}>Project Name (optional)</label>
              <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="My campaign" style={{
                padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem'
              }} />
            </div>
          </div>

          {productType !== 'link_insertion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
              <label style={{ fontSize: '.85rem', fontWeight: 600, color: '#334155' }}>
                Content <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={6}
                placeholder="Paste your article content here..."
                style={{ padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem', resize: 'vertical' }} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
              <label style={{ fontSize: '.85rem', fontWeight: 600, color: '#334155' }}>
                Promoted URL <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input value={promotedUrl} onChange={e => setPromotedUrl(e.target.value)}
                placeholder="https://yoursite.com/page" style={{
                  padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem'
                }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
              <label style={{ fontSize: '.85rem', fontWeight: 600, color: '#334155' }}>Anchor Text</label>
              <input value={anchorText} onChange={e => setAnchorText(e.target.value)}
                placeholder="best seo tools" style={{
                  padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem'
                }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            <label style={{ fontSize: '.85rem', fontWeight: 600, color: '#334155' }}>Special Requirements</label>
            <textarea value={specialRequirements} onChange={e => setSpecialRequirements(e.target.value)} rows={3}
              placeholder="Any special instructions for the publisher..."
              style={{ padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem', resize: 'vertical' }} />
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem', background: '#f8fafc', borderRadius: 8
          }}>
            <div>
              <div style={{ fontSize: '.75rem', color: '#64748b' }}>Total Price</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563eb' }}>{formatPrice(price)}</div>
            </div>
            <button type="submit" disabled={submitting} style={{
              padding: '.75rem 2rem', background: submitting ? '#94a3b8' : '#2563eb', color: 'white',
              border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '.95rem', cursor: submitting ? 'default' : 'pointer'
            }}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          {submitMsg && (
            <div style={{
              padding: '.75rem', borderRadius: 8, fontSize: '.85rem',
              background: submitMsg.includes('success') ? '#f0fdf4' : '#fef2f2',
              color: submitMsg.includes('success') ? '#10b981' : '#ef4444',
              border: `1px solid ${submitMsg.includes('success') ? '#bbf7d0' : '#fecaca'}`
            }}>
              {submitMsg}
            </div>
          )}
        </form>
      </div>

      {/* Reviews */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
          Reviews ({site.review_count})
        </h2>
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            <p>No reviews yet. Be the first to review this site!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map((r: Review) => (
              <div key={r.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{r.reviewer_name}</div>
                  <div style={{ display: 'flex', gap: '.25rem', fontSize: '.85rem' }}>
                    <span style={{ color: '#f59e0b' }}>{starRating(r.rating)}</span>
                    <span style={{ color: '#94a3b8', fontSize: '.75rem' }}>{formatDate(r.created_at)}</span>
                  </div>
                </div>
                {r.comment && <p style={{ fontSize: '.9rem', color: '#475569', lineHeight: 1.6 }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
