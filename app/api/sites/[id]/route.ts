import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(params.id) as any;
  if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });

  // Verify ownership for publishers
  if (session.role === 'publisher') {
    const ownership = db.prepare(
      'SELECT id FROM publisher_sites WHERE user_id = ? AND site_id = ?'
    ).get(session.id, params.id);
    if (!ownership) return NextResponse.json({ error: 'Not your site' }, { status: 403 });
  }

  return NextResponse.json({ site });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get('session_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();

  const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(params.id) as any;
  if (!site) return NextResponse.json({ error: 'Site not found' }, { status: 404 });

  if (session.role === 'publisher') {
    const ownership = db.prepare(
      'SELECT id FROM publisher_sites WHERE user_id = ? AND site_id = ?'
    ).get(session.id, params.id);
    if (!ownership) return NextResponse.json({ error: 'Not your site' }, { status: 403 });
  }

  const body = await request.json();
  const updates: string[] = [];
  const values: any[] = [];

  const fields = [
    'language', 'country', 'categories', 'site_requirements',
    'content_placement_price', 'writing_placement_price',
    'min_words', 'max_links_per_article', 'link_attribution',
    'sponsored_marked',
  ];

  for (const field of fields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    values.push(params.id);
    db.prepare(`UPDATE sites SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }

  return NextResponse.json({ message: 'Site updated' });
}
