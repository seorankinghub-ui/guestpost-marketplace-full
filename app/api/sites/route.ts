import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const my = request.nextUrl.searchParams.get('my');

  if (my === 'true' && session.role === 'publisher') {
    const siteRows = db.prepare(`
      SELECT s.*, ps.is_owner
      FROM sites s
      JOIN publisher_sites ps ON s.id = ps.site_id
      WHERE ps.user_id = ?
      ORDER BY s.created_at DESC
    `).all(session.id) as any[];
    return NextResponse.json({ sites: siteRows });
  }

  // General list (admin or buyer catalog)
  const sites = db.prepare(`
    SELECT s.*, u.name as owner_name FROM sites s
    LEFT JOIN publisher_sites ps ON s.id = ps.site_id AND ps.is_owner = 1
    LEFT JOIN users u ON ps.user_id = u.id
    WHERE s.status = 'approved'
    ORDER BY s.moz_da DESC
  `).all() as any[];
  return NextResponse.json({ sites });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session || session.role !== 'publisher') {
    return NextResponse.json({ error: 'Only publishers can add sites' }, { status: 403 });
  }

  const body = await request.json();
  const {
    domain, language = 'English', country = 'US', categories = '[]',
    content_placement_price = 50, writing_placement_price = 65,
    site_requirements = '', min_words = 500, max_links_per_article = 2,
  } = body;

  if (!domain) return NextResponse.json({ error: 'Domain is required' }, { status: 400 });

  const db = getDb();
  const url = domain.startsWith('http') ? domain : `https://${domain}`;

  const insertSite = db.prepare(`
    INSERT INTO sites (domain, url, language, country, categories, site_requirements,
      content_placement_price, writing_placement_price, min_words, max_links_per_article,
      status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `);

  const result = insertSite.run(domain, url, language, country, categories, site_requirements,
    content_placement_price, writing_placement_price, min_words, max_links_per_article);

  // Link publisher
  db.prepare('INSERT INTO publisher_sites (user_id, site_id, is_owner) VALUES (?, ?, 1)')
    .run(session.id, result.lastInsertRowid);

  return NextResponse.json({
    site: { id: result.lastInsertRowid, domain, status: 'pending' },
    message: 'Site submitted for review',
  }, { status: 201 });
}
