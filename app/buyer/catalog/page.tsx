export const dynamic = 'force-dynamic';

import Link from 'next/link';

interface Props { searchParams: { [key: string]: string | undefined }; }

const ALL_SITES = [
  { id:1, domain:'techinsider.com', moz_da:72, ahrefs_dr:68, traffic:'245K/mo', language:'English', category:'Technology', country:'USA', content_price:95, writing_price:115, status:'approved', rating:4.8, reviews:124 },
  { id:2, domain:'healthwise.org', moz_da:65, ahrefs_dr:60, traffic:'180K/mo', language:'English', category:'Health', country:'USA', content_price:78, writing_price:92, status:'approved', rating:4.7, reviews:89 },
  { id:3, domain:'financepulse.com', moz_da:58, ahrefs_dr:54, traffic:'320K/mo', language:'English', category:'Finance', country:'USA', content_price:120, writing_price:145, status:'approved', rating:4.9, reviews:56 },
  { id:4, domain:'travelvista.com', moz_da:55, ahrefs_dr:50, traffic:'95K/mo', language:'English', category:'Travel', country:'USA', content_price:65, writing_price:78, status:'approved', rating:4.6, reviews:42 },
  { id:5, domain:'bizgrowth.com', moz_da:48, ahrefs_dr:44, traffic:'62K/mo', language:'English', category:'Business', country:'USA', content_price:52, writing_price:63, status:'approved', rating:4.5, reviews:31 },
  { id:6, domain:'lifestylehub.com', moz_da:42, ahrefs_dr:38, traffic:'41K/mo', language:'English', category:'Lifestyle', country:'USA', content_price:35, writing_price:45, status:'approved', rating:4.4, reviews:28 },
  { id:7, domain:'digitaltrends.co.uk', moz_da:60, ahrefs_dr:55, traffic:'120K/mo', language:'English', category:'Technology', country:'UK', content_price:85, writing_price:100, status:'approved', rating:4.6, reviews:67 },
  { id:8, domain:'sportswave.de', moz_da:45, ahrefs_dr:40, traffic:'80K/mo', language:'German', category:'Sports', country:'Germany', content_price:55, writing_price:68, status:'approved', rating:4.3, reviews:19 },
  { id:9, domain:'cuisinefrancaise.fr', moz_da:50, ahrefs_dr:46, traffic:'90K/mo', language:'French', category:'Food', country:'France', content_price:48, writing_price:60, status:'approved', rating:4.5, reviews:34 },
  { id:10, domain:'marketingpro.io', moz_da:38, ahrefs_dr:35, traffic:'55K/mo', language:'English', category:'Marketing', country:'USA', content_price:40, writing_price:52, status:'approved', rating:4.2, reviews:22 },
  { id:11, domain:'cryptoinsider.io', moz_da:52, ahrefs_dr:48, traffic:'150K/mo', language:'English', category:'Crypto', country:'USA', content_price:110, writing_price:130, status:'approved', rating:4.7, reviews:45 },
  { id:12, domain:'ecofriendly.org', moz_da:44, ahrefs_dr:40, traffic:'70K/mo', language:'English', category:'Environment', country:'USA', content_price:30, writing_price:42, status:'approved', rating:4.4, reviews:18 },
];

const categories = ['All','Technology','Health','Finance','Travel','Business','Lifestyle','Sports','Food','Marketing','Crypto','Environment'];

export default async function CatalogPage({ searchParams }: Props) {
  const cat = searchParams.category || 'All';
  const sort = searchParams.sort || 'da_desc';
  const search = searchParams.search || '';

  let filtered = ALL_SITES;
  if (cat !== 'All') filtered = filtered.filter(s => s.category === cat);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s => s.domain.includes(q) || s.category.toLowerCase().includes(q));
  }

  if (sort === 'da_desc') filtered.sort((a,b) => b.moz_da - a.moz_da);
  else if (sort === 'da_asc') filtered.sort((a,b) => a.moz_da - b.moz_da);
  else if (sort === 'price_asc') filtered.sort((a,b) => a.content_price - b.content_price);
  else if (sort === 'price_desc') filtered.sort((a,b) => b.content_price - a.content_price);
  else if (sort === 'traffic') filtered.sort((a,b) => parseInt(b.traffic) - parseInt(a.traffic));

  return (
    <div>
      <h1 style={{ fontSize:'1.75rem', fontWeight:700, marginBottom:'.25rem' }}>Browse Sites</h1>
      <p style={{ color:'#64748b', marginBottom:'1.5rem' }}>
        {filtered.length} sites available. Filter by category, sort by metrics.
      </p>

      {/* Category filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.35rem', marginBottom:'1.25rem' }}>
        {categories.map(c => (
          <Link key={c} href={`/buyer/catalog?category=${c}&sort=${sort}`} style={{
            padding:'.4rem .75rem', borderRadius:100, fontSize:'.78rem', fontWeight:500, textDecoration:'none',
            background: cat === c ? '#2563eb' : '#f1f5f9', color: cat === c ? 'white' : '#475569',
            whiteSpace:'nowrap'
          }}>{c}</Link>
        ))}
      </div>

      {/* Sort + Search */}
      <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
        <select onChange={(e: any) => { if (typeof window !== 'undefined') window.location.href = `/buyer/catalog?category=${cat}&sort=${e.target.value}`; }}
          defaultValue={sort}
          style={{ padding:'.45rem .75rem', border:'1px solid #d1d5db', borderRadius:6, fontSize:'.85rem', background:'white' }}>
          <option value="da_desc">Highest DA first</option>
          <option value="da_asc">Lowest DA first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="traffic">Most Traffic</option>
        </select>
        <form style={{ flex:1, minWidth:200 }}>
          <input name="search" defaultValue={search} placeholder="Search domains..."
            style={{ width:'100%', padding:'.45rem .75rem', border:'1px solid #d1d5db', borderRadius:6, fontSize:'.85rem', boxSizing:'border-box' }} />
        </form>
      </div>

      {/* Site cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1rem' }}>
        {filtered.map(site => (
          <Link key={site.id} href={`/buyer/catalog/${site.id}`} style={{
            background:'white', border:'1px solid #e2e8f0', borderRadius:10, padding:'1.25rem',
            textDecoration:'none', transition:'all .2s', color:'inherit', display:'block'
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.75rem' }}>
              <span style={{ fontWeight:700, fontSize:'.95rem', color:'#1e293b' }}>{site.domain}</span>
              <span style={{ display:'flex', alignItems:'center', gap:'.25rem', color:'#d97706', fontSize:'.85rem', fontWeight:600 }}>
                ⭐ {site.rating} ({site.reviews})
              </span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.5rem', marginBottom:'.75rem' }}>
              <div><span style={{ fontSize:'.65rem', color:'#94a3b8', textTransform:'uppercase' }}>Moz DA</span><br /><span style={{ fontWeight:600 }}>{site.moz_da}</span></div>
              <div><span style={{ fontSize:'.65rem', color:'#94a3b8', textTransform:'uppercase' }}>Ahrefs DR</span><br /><span style={{ fontWeight:600 }}>{site.ahrefs_dr}</span></div>
              <div><span style={{ fontSize:'.65rem', color:'#94a3b8', textTransform:'uppercase' }}>Traffic</span><br /><span style={{ fontWeight:600 }}>{site.traffic}</span></div>
              <div><span style={{ fontSize:'.65rem', color:'#94a3b8', textTransform:'uppercase' }}>Language</span><br /><span style={{ fontWeight:600 }}>{site.language}</span></div>
            </div>
            <div style={{ display:'flex', gap:'.5rem', paddingTop:'.75rem', borderTop:'1px solid #f1f5f9' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'.6rem', color:'#94a3b8', textTransform:'uppercase' }}>Content</div>
                <div style={{ fontWeight:700, color:'#2563eb' }}>${site.content_price}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'.6rem', color:'#94a3b8', textTransform:'uppercase' }}>Writing</div>
                <div style={{ fontWeight:700, color:'#64748b' }}>${site.writing_price}</div>
              </div>
              <span style={{ fontSize:'.65rem', padding:'.15rem .5rem', borderRadius:100, background:'#dbeafe', color:'#1d4ed8', fontWeight:600, alignSelf:'center' }}>{site.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
