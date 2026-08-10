import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const session = getSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const db = getDb();
    const { site_id, rating, comment } = await request.json();

    if (!site_id || !rating) {
      return NextResponse.json({ error: 'site_id and rating are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check that the site exists
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(site_id) as any;
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Verify the user has completed an order on this site
    const completedOrder = db.prepare(`
      SELECT id FROM orders 
      WHERE buyer_id = ? AND site_id = ? AND status = 'completed'
      LIMIT 1
    `).get(session.id, site_id) as any;

    if (!completedOrder) {
      return NextResponse.json(
        { error: 'You must have a completed order on this site to leave a review' },
        { status: 403 }
      );
    }

    // Check for existing review
    const existing = db.prepare(
      'SELECT id FROM reviews WHERE user_id = ? AND site_id = ?'
    ).get(session.id, site_id) as any;

    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this site' }, { status: 409 });
    }

    // Create the review
    const result = db.prepare(`
      INSERT INTO reviews (user_id, site_id, order_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(session.id, site_id, completedOrder.id, rating, comment || null);

    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid) as any;

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
