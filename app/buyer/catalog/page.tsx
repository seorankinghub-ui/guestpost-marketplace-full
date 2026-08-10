import { getDb } from '@/lib/db';
import Link from 'next/link';
import SiteCard from '@/components/SiteCard';

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function CatalogPage({ searchParams }: Props) {
  const db = getDb();
  const category = searchParams.category || '';
  const search = searchParams.search || '';
  const min_da = searchParams.min_da || '';
  const max_da = searchParams.max_da || '';
  const min_price = searchParams.min_price || '';
  const max_price = searchParams.max_price || '';
  const sort = searchParams.sort || 'da_desc';
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const offset = (page - 1) * limit;

  // Build query
  let where = "WHERE s.status = 'approved'";
  const params: any[] = [];

  if (category) {
    where += ' AND s.categories LIKE ?';
    params.push(`%\"${category}\"%`);
  }
  if (search) {
    where += ' AND (s.domain LIKE ? OR s.url LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (min_da) {
    where += ' AND s.moz_da >= ?';
    params.push(parseInt(min_da));
  }
  if (max_da) {
    where += ' AND s.moz_da <= ?';
    params.push(parseInt(max_da));
  }
  if (min_price) {
    where += ' AND s.content_placement_price >= ?';
    params.push(parseFloat(min_price));
  }
  if (max_price) {
    where += ' AND s.content_placement_price <= ?';
    params.push(parseFloat(max_price));
  }

  let orderBy = 'ORDER BY s.moz_da DESC';
  if (sort === 'da_asc') orderBy = 'ORDER BY s.moz_da ASC';
  else if (sort === 'traffic_desc') orderBy = 'ORDER BY s.organic_traffic DESC';
  else if (sort === 'traffic_asc') orderBy = 'ORDER BY s.organic_traffic ASC';
  else if (sort === 'price_asc') orderBy = 'ORDER BY s.content_placement_price ASC';
  else if (sort === 'price_desc') orderBy = 'ORDER BY s.content_placement_price DESC';
  else if (sort === 'newest') orderBy = 'ORDER BY s.created_at DESC';
  else if (sort === 'rating') orderBy = 'ORDER BY s.completion_rate DESC';

  const sites = db.prepare(`
    SELECT s.*,
      COALESCE((SELECT AVG(rating) FROM reviews WHERE site_id = s.id), 0) as avg_rating,
      (SELECT COUNT(*) FROM reviews WHERE site_id = s.id) as review_count
    FROM sites s
    ${where}
    ${orderBy}
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as any[];

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM sites s ${where}`).get(...params) as any;
  const totalSites = countRow.total;
  const totalPages = Math.ceil(totalSites / limit);

  // Distinct categories
  const categoryRows = db.prepare(`SELECT DISTINCT categories FROM sites WHERE status = 'approved'`).all() as any[];
  const distinctCategories = [...new Set(categoryRows.flatMap((r: any) => {
    try { return JSON.parse(r.categories); } catch { return []; }
  }))].sort() as string[];

  const sortOptions = [
    { value: 'da_desc', label: 'DA: High to Low' },
    { value: 'da_asc', label: 'DA: Low to High' },
    { value: 'traffic_desc', label: 'Traffic: High to Low' },
    { value: 'traffic_asc', label: 'Traffic: Low to High' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' },
  ];

  const buildQueryString = (overrides: Record<string, string>) => {
    const q = new URLSearchParams();
    q.set('category', overrides.category ?? category);
    q.set('min_da', overrides.min_da ?? min_da);
    q.set('max_da', overrides.max_da ?? max_da);
    q.set('min_price', overrides.min_price ?? min_price);
    q.set('max_price', overrides.max_price ?? max_price);
    q.set('search', overrides.search ?? search);
    q.set('sort', overrides.sort ?? sort);
    q.set('page', '1');
    return `/catalog?${q.toString()}`;
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>Browse Sites</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Find the perfect sites for your guest post campaigns.
      </p>

      {/* Filter Bar */}
      <div style={{
        background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '1.25rem', marginBottom: '1.5rem'
      }}>
        <form method="get" action="/catalog" style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', alignItems: 'flex-end' }}>
          {/* Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', minWidth: 140 }}>
            <label style={{ fontSize: '.75rem', fontWeight: 600, color: '#64748b' }}>Category</label>
            <select name="category" defaultValue={category} style={{
              padding: '.5rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6,
              fontSize: '.85rem', background: 'white', color: '#334155'
            }}>
              <option value="">All Categories</option>
              {distinctCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* DA Range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', minWidth: 80 }}>
            <label style={{ fontSize: '.75rem', fontWeight: 600, color: '#64748b' }}>Min DA</label>
            <input name="min_da" type="number" placeholder="0" defaultValue={min_da} style={{
              padding: '.5rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.85rem', width: 80
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', minWidth: 80 }}>
            <label style={{ fontSize: '.75rem', fontWeight: 600, color: '#64748b' }}>Max DA</label>
            <input name="max_da" type="number" placeholder="100" defaultValue={max_da} style={{
              padding: '.5rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.85rem', width: 80
            }} />
          </div>

          {/* Price Range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', minWidth: 80 }}>
            <label style={{ fontSize: '.75rem', fontWeight: 600, color: '#64748b' }}>Min Price</label>
            <input name="min_price" type="number" placeholder="$0" defaultValue={min_price} style={{
              padding: '.5rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.85rem', width: 80
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', minWidth: 80 }}>
            <label style={{ fontSize: '.75rem', fontWeight: 600, color: '#64748b' }}>Max Price</label>
            <input name="max_price" type="number" placeholder="$500" defaultValue={max_price} style={{
              padding: '.5rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.85rem', width: 80
            }} />
          </div>

          {/* Search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', minWidth: 180, flex: 1 }}>
            <label style={{ fontSize: '.75rem', fontWeight: 600, color: '#64748b' }}>Search</label>
            <input name="search" type="text" placeholder="Search by domain..." defaultValue={search} style={{
              padding: '.5rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.85rem'
            }} />
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem', minWidth: 150 }}>
            <label style={{ fontSize: '.75rem', fontWeight: 600, color: '#64748b' }}>Sort By</label>
            <select name="sort" defaultValue={sort} style={{
              padding: '.5rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6,
              fontSize: '.85rem', background: 'white', color: '#334155'
            }}>
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={{
            padding: '.5rem 1.25rem', background: '#2563eb', color: 'white',
            border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '.85rem', cursor: 'pointer'
          }}>
            Filter
          </button>
        </form>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1rem', fontSize: '.85rem', color: '#64748b' }}>
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, totalSites)} of {totalSites} sites
      </div>

      {/* Site Grid */}
      {sites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '.5rem', color: '#64748b' }}>No sites found</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem', marginBottom: '2rem'
        }}>
          {sites.map((site: any) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1rem' }}>
          {page > 1 && (
            <Link href={buildQueryString({ page: String(page - 1) })} style={{
              padding: '.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 6,
              color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '.85rem'
            }}>
              ← Previous
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const startPage = Math.max(1, Math.min(page - 4, totalPages - 9));
            const p = startPage + i;
            if (p > totalPages) return null;
            return (
              <Link key={p} href={buildQueryString({ page: String(p) })} style={{
                padding: '.5rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6,
                color: p === page ? 'white' : '#2563eb', background: p === page ? '#2563eb' : 'white',
                textDecoration: 'none', fontWeight: 500, fontSize: '.85rem', minWidth: 36, textAlign: 'center'
              }}>
                {p}
              </Link>
            );
          })}
          {page < totalPages && (
            <Link href={buildQueryString({ page: String(page + 1) })} style={{
              padding: '.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: 6,
              color: '#2563eb', textDecoration: 'none', fontWeight: 500, fontSize: '.85rem'
            }}>
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
