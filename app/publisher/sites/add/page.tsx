export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

export default async function PublisherAddSitePage() {
  const token = cookies().get('session_token')?.value;
  const session = getSession(token || '');
  if (!session || session.role !== 'publisher') {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>🔐 Please log in as publisher.</div>;
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add New Site</h1>
      <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', fontSize: '.9rem', color: '#1e40af' }}>
        ℹ️ Site submission form. Your site will be reviewed by our team within 24-48 hours.
      </div>
      <form style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: '.4rem' }}>Domain URL</label>
        <input type="text" placeholder="e.g. mysite.com" style={{ width: '100%', padding: '.65rem', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '.9rem', marginBottom: '1rem', boxSizing: 'border-box' }} />

        <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: '.4rem' }}>Category</label>
        <select style={{ width: '100%', padding: '.65rem', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '.9rem', marginBottom: '1rem', boxSizing: 'border-box', background: 'white' }}>
          <option>Technology</option><option>Health</option><option>Finance</option><option>Business</option><option>Travel</option><option>Lifestyle</option><option>Education</option>
        </select>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: '.4rem' }}>Moz DA</label>
            <input type="number" placeholder="0-100" style={{ width: '100%', padding: '.65rem', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: '.4rem' }}>Ahrefs DR</label>
            <input type="number" placeholder="0-100" style={{ width: '100%', padding: '.65rem', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: '.4rem' }}>Content Placement Price ($)</label>
            <input type="number" placeholder="95" style={{ width: '100%', padding: '.65rem', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#374151', marginBottom: '.4rem' }}>Writing + Placement ($)</label>
            <input type="number" placeholder="115" style={{ width: '100%', padding: '.65rem', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '.9rem', boxSizing: 'border-box' }} />
          </div>
        </div>

        <button type="submit" style={{ marginTop: '1.5rem', width: '100%', background: '#2563eb', color: 'white', padding: '.75rem', border: 'none', borderRadius: 8, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
          Submit for Review
        </button>
      </form>
    </div>
  );
}
