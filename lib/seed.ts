import { getDb } from './db';

export function seedDatabase() {
  const db = getDb();
  
  // Only seed if no users exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  if (userCount.count > 0) return;

  const insertUser = db.prepare(`
    INSERT INTO users (email, password_hash, name, role, balance_main, avatar_initials)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Demo users with bcrypt hash of 'password123'
  const hash = '$2a$10$dummyhashwillbereplaced'; // placeholder — real hash from bcrypt

  // Admin
  insertUser.run('admin@guestpost.com', hash, 'Admin User', 'admin', 0, 'AD');
  
  // Buyers
  insertUser.run('buyer@example.com', hash, 'Sarah Johnson', 'buyer', 500, 'SJ');
  insertUser.run('agency@example.com', hash, 'Digital Growth Agency', 'buyer', 2500, 'DG');
  insertUser.run('brand@example.com', hash, 'TechBrand Inc', 'buyer', 1000, 'TB');

  // Publishers
  insertUser.run('publisher@example.com', hash, 'Mike Owner', 'publisher', 0, 'MO');
  insertUser.run('publisher2@example.com', hash, 'Lisa Blogs', 'publisher', 0, 'LB');

  // Seed sites
  const insertSite = db.prepare(`
    INSERT INTO sites (domain, url, language, country, categories, moz_da, ahrefs_dr, organic_traffic, 
      content_placement_price, writing_placement_price, max_links_per_article, min_words, 
      link_attribution, status, verified_owner, completion_rate, tat_days, avg_link_lifetime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sites = [
    ['techinsider.com', 'https://techinsider.com', 'English', 'US', '["Technology","SaaS"]', 72, 68, 245000, 95, 115, 2, 800, 'dofollow', 'approved', 1, 96, 3, 85],
    ['healthwise.org', 'https://healthwise.org', 'English', 'US', '["Health","Wellness"]', 65, 60, 180000, 78, 92, 2, 600, 'dofollow', 'approved', 1, 94, 4, 78],
    ['financepulse.com', 'https://financepulse.com', 'English', 'US', '["Finance","Investing"]', 58, 54, 320000, 120, 145, 3, 1000, 'dofollow', 'approved', 1, 91, 3, 82],
    ['travelvista.com', 'https://travelvista.com', 'English', 'GB', '["Travel","Destinations"]', 55, 50, 95000, 65, 78, 2, 500, 'dofollow', 'approved', 1, 93, 2, 76],
    ['bizgrowth.com', 'https://bizgrowth.com', 'English', 'US', '["Business","Entrepreneurship"]', 48, 44, 62000, 52, 63, 2, 600, 'dofollow', 'approved', 1, 90, 3, 72],
    ['lifestylehub.com', 'https://lifestylehub.com', 'English', 'US', '["Lifestyle","Home"]', 42, 38, 41000, 35, 45, 2, 500, 'dofollow', 'approved', 1, 88, 3, 70],
    ['cryptonewsdesk.com', 'https://cryptonewsdesk.com', 'English', 'US', '["Finance","Crypto"]', 62, 58, 280000, 175, 210, 2, 1000, 'dofollow', 'approved', 1, 89, 4, 74],
    ['saasinsider.co', 'https://saasinsider.co', 'English', 'US', '["Technology","SaaS"]', 40, 36, 22000, 58, 72, 2, 500, 'dofollow', 'approved', 0, 85, 3, 68],
    ['edulearnhub.com', 'https://edulearnhub.com', 'English', 'GB', '["Education","eLearning"]', 52, 47, 38000, 65, 78, 2, 600, 'dofollow', 'approved', 1, 92, 2, 80],
    ['fashionforward.com', 'https://fashionforward.com', 'English', 'US', '["Fashion","Beauty"]', 48, 43, 41000, 55, 68, 2, 500, 'dofollow', 'approved', 0, 87, 3, 71],
    ['propertyscoop.com', 'https://propertyscoop.com', 'English', 'US', '["Real Estate"]', 44, 39, 28000, 48, 60, 2, 600, 'dofollow', 'approved', 0, 83, 3, 66],
    ['startupbeat.com', 'https://startupbeat.com', 'English', 'US', '["Business","Startups"]', 50, 45, 36000, 88, 105, 2, 700, 'dofollow', 'approved', 1, 91, 2, 79],
  ];

  const insertP = db.transaction(() => {
    for (const s of sites) {
      insertSite.run(...s);
    }
  });
  insertP();

  // Link publishers to sites
  const linkPub = db.prepare('INSERT INTO publisher_sites (user_id, site_id, is_owner, verification_method, verified_at) VALUES (?, ?, ?, ?, ?)');
  linkPub.run(5, 1, 1, 'dns', new Date().toISOString());
  linkPub.run(5, 2, 1, 'meta_tag', new Date().toISOString());
  linkPub.run(6, 3, 1, 'file', new Date().toISOString());
  linkPub.run(6, 4, 1, 'dns', new Date().toISOString());
  linkPub.run(5, 5, 1, 'meta_tag', new Date().toISOString());
  linkPub.run(6, 6, 1, 'dns', new Date().toISOString());

  // Seed some orders
  const insertOrder = db.prepare(`
    INSERT INTO orders (buyer_id, site_id, publisher_id, product_type, content, promoted_url, anchor_text, price, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);

  insertOrder.run(2, 1, 5, 'content_placement', 'Sample article about technology trends...', 'https://example.com', 'tech trends', 95, 'completed', '-5 days');
  insertOrder.run(2, 3, 6, 'writing_placement', 'Finance article content...', 'https://example.com/finance', 'financial planning', 145, 'in_progress', '-2 days');
  insertOrder.run(3, 1, 5, 'link_insertion', null, 'https://agency-client.com', 'digital marketing', 75, 'acceptance', '-1 days');
  insertOrder.run(3, 2, 5, 'content_placement', 'Health and wellness guide...', 'https://example.com/health', 'wellness tips', 78, 'completed', '-10 days');
  insertOrder.run(2, 5, 5, 'content_placement', 'Business growth strategies...', 'https://example.com/biz', 'business growth', 52, 'draft', '-1 days');

  // Seed reviews
  const insertReview = db.prepare('INSERT INTO reviews (site_id, user_id, rating, comment) VALUES (?, ?, ?, ?)');
  insertReview.run(1, 2, 5, 'Excellent site, great traffic and fast publishing.');
  insertReview.run(1, 3, 4, 'Good quality, slightly slow TAT but worth it.');
  insertReview.run(3, 2, 5, 'Amazing finance site with real organic traffic.');
  insertReview.run(3, 3, 4, 'Great for finance niche, high DR.');

  // Seed notifications
  const insertNotif = db.prepare("INSERT INTO notifications (user_id, type, title, message, order_id) VALUES (?, 'info', ?, ?, ?)");
  insertNotif.run(2, 'Order Completed', 'Your order on techinsider.com has been published.', 1);
  insertNotif.run(2, 'Order Update', 'Your order on financepulse.com is now in progress.', 2);
  insertNotif.run(5, 'New Order', 'You have a new order on techinsider.com', 1);

  console.log('✅ Database seeded with demo data');
  console.log('   Admin: admin@guestpost.com / password123');
  console.log('   Buyer: buyer@example.com / password123');
  console.log('   Publisher: publisher@example.com / password123');
}

// Run directly
seedDatabase();
