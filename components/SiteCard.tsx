import Link from 'next/link';

interface SiteCardProps {
  site: {
    id: number;
    domain: string;
    url: string;
    categories: string;
    moz_da: number;
    ahrefs_dr: number;
    organic_traffic: number;
    content_placement_price: number;
    writing_placement_price: number;
    status: string;
    verified_owner: number;
    avg_rating: number;
    review_count: number;
    language?: string;
    country?: string;
    completion_rate?: number;
    tat_days?: number;
  };
}

const starRating = (rating: number) => '⭐'.repeat(Math.round(rating)) + (rating < 1 ? '☆'.repeat(5) : '☆'.repeat(5 - Math.round(rating)));

const formatTraffic = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
};

const formatPrice = (p: number) => `$${p.toFixed(2)}`;

export default function SiteCard({ site }: SiteCardProps) {
  const cats = (() => { try { return JSON.parse(site.categories); } catch { return []; } })();

  return (
    <div style={{
      background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
      overflow: 'hidden', transition: 'box-shadow .2s, transform .2s',
      cursor: 'default'
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,.08)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      {/* Header */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <Link href={`/catalog/${site.id}`} style={{
                fontWeight: 700, fontSize: '1.05rem', color: '#1e293b', textDecoration: 'none'
              }}>
                {site.domain}
              </Link>
              {site.verified_owner ? (
                <span style={{
                  fontSize: '.7rem', background: '#dcfce7', color: '#16a34a',
                  padding: '.1rem .4rem', borderRadius: 4, fontWeight: 600
                }} title="Verified Owner">✓ Verified</span>
              ) : null}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '.8rem', color: '#f59e0b' }}>{starRating(site.avg_rating)}</div>
            <div style={{ fontSize: '.65rem', color: '#94a3b8' }}>{site.review_count} reviews</div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
          {cats.slice(0, 3).map((c: string) => (
            <span key={c} style={{
              padding: '.15rem .5rem', background: '#eff6ff', color: '#2563eb',
              borderRadius: 10, fontSize: '.7rem', fontWeight: 500
            }}>
              {c}
            </span>
          ))}
          {cats.length > 3 && (
            <span style={{ fontSize: '.7rem', color: '#94a3b8' }}>+{cats.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb' }}>{site.moz_da}</div>
            <div style={{ fontSize: '.65rem', color: '#94a3b8', fontWeight: 600 }}>DA</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{site.ahrefs_dr}</div>
            <div style={{ fontSize: '.65rem', color: '#94a3b8', fontWeight: 600 }}>DR</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{formatTraffic(site.organic_traffic)}</div>
            <div style={{ fontSize: '.65rem', color: '#94a3b8', fontWeight: 600 }}>Traffic</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#8b5cf6' }}>{site.completion_rate || '—'}%</div>
            <div style={{ fontSize: '.65rem', color: '#94a3b8', fontWeight: 600 }}>Completion</div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem' }}>
          <div>
            <div style={{ color: '#64748b', marginBottom: '.15rem' }}>Content Placement</div>
            <div style={{ fontWeight: 700, color: '#2563eb' }}>{formatPrice(site.content_placement_price)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#64748b', marginBottom: '.15rem' }}>Writing & Placement</div>
            <div style={{ fontWeight: 700, color: '#10b981' }}>{formatPrice(site.writing_placement_price)}</div>
          </div>
        </div>
      </div>

      {/* TAT Info */}
      {(site.tat_days || site.language || site.country) && (
        <div style={{ padding: '.75rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1rem', fontSize: '.75rem' }}>
          {site.tat_days && <span style={{ color: '#64748b' }}>⏱️ {site.tat_days} days TAT</span>}
          {site.language && <span style={{ color: '#64748b' }}>🌐 {site.language}</span>}
          {site.country && <span style={{ color: '#64748b' }}>📍 {site.country}</span>}
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <Link href={`/catalog/${site.id}`} style={{
            flex: 1, textAlign: 'center', padding: '.55rem .75rem',
            background: '#2563eb', color: 'white', borderRadius: 6,
            textDecoration: 'none', fontWeight: 600, fontSize: '.8rem'
          }}>
            View Details
          </Link>
          <Link href={`/catalog/${site.id}#order`} style={{
            flex: 1, textAlign: 'center', padding: '.55rem .75rem',
            background: '#f1f5f9', color: '#334155', borderRadius: 6,
            textDecoration: 'none', fontWeight: 600, fontSize: '.8rem'
          }}>
            Place Order
          </Link>
        </div>
      </div>
    </div>
  );
}
