'use client';

import { useState } from 'react';
import Link from 'next/link';
import './marketing.css';

export default function MarketingHomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `/signup?email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <div className="marketing-page">
      {/* ==================== HEADER ==================== */}
      <header className="m-header">
        <div className="m-container">
          <Link href="/" className="m-header-logo">
            GuestPost<span>Marketplace</span>
          </Link>
          <nav className="m-nav">
            <div className="m-dropdown">
              <span>Solutions ▾</span>
              <div className="m-dropdown-menu">
                <Link href="/buyer/catalog">For Brands</Link>
                <Link href="/buyer/catalog">For Agencies</Link>
                <Link href="/buyer/catalog">Content Placement</Link>
                <Link href="/buyer/catalog">Link Insertion</Link>
              </div>
            </div>
            <Link href="/buyer/catalog">Browse Sites</Link>
            <Link href="/publisher">For Publishers</Link>
            <span className="m-nav-link">Blog</span>
            <span className="m-nav-link">FAQ</span>
            <Link href="/login" className="m-btn m-btn-outline m-btn-sm">Log In</Link>
            <Link href="/signup" className="m-btn m-btn-primary m-btn-sm">Sign Up</Link>
          </nav>
          <button className="m-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* ==================== MOBILE MENU ==================== */}
      <div className={`m-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link href="/buyer/catalog" onClick={() => setMobileOpen(false)}>Browse Sites</Link>
        <Link href="/buyer/catalog" onClick={() => setMobileOpen(false)}>For Brands</Link>
        <Link href="/buyer/catalog" onClick={() => setMobileOpen(false)}>For Agencies</Link>
        <Link href="/publisher" onClick={() => setMobileOpen(false)}>For Publishers</Link>
        <span className="m-nav-link">Blog</span>
        <span className="m-nav-link">FAQ</span>
        <div className="m-mobile-cta">
          <Link href="/signup" className="m-btn m-btn-primary" onClick={() => setMobileOpen(false)}>Sign Up for Free</Link>
          <Link href="/login" className="m-btn m-btn-outline" onClick={() => setMobileOpen(false)}>Log In</Link>
        </div>
      </div>

      {/* ==================== HERO ==================== */}
      <section className="m-hero">
        <div className="m-container">
          <div className="m-hero-content">
            <h1>Digital PR &amp; Blog &amp; <span className="m-highlight">Guest Posting Service</span></h1>
            <p className="m-hero-subtitle">Place your content on 150,000+ high-quality websites. Get backlinks from real sites with verified metrics. The fast, friendly &amp; secure guest posting process.</p>
            <div className="m-hero-actions">
              <Link href="/signup" className="m-btn m-btn-primary m-btn-lg">Sign Up for Free</Link>
              <Link href="/buyer/catalog" className="m-btn m-btn-outline m-btn-lg">Browse Sites</Link>
            </div>
            <div className="m-hero-actions">
              <span className="m-divider">⭐ Trusted by 10,000+ marketers worldwide</span>
            </div>
          </div>
          <div className="m-hero-visual">
            <div className="m-hero-card">
              <div className="m-stat-row">
                <div className="m-stat">
                  <div className="m-stat-value">150K+</div>
                  <div className="m-stat-label">Websites</div>
                </div>
                <div className="m-stat">
                  <div className="m-stat-value">15K+</div>
                  <div className="m-stat-label">New This Month</div>
                </div>
                <div className="m-stat">
                  <div className="m-stat-value">45K+</div>
                  <div className="m-stat-label">Reviews</div>
                </div>
              </div>
              <div className="m-site-preview">
                <div className="m-dot" />
                <span className="m-url">techinsider.com</span>
                <span className="m-price">from $95</span>
                <span className="m-badge m-badge-verified">DA 72</span>
              </div>
              <div className="m-site-preview" style={{ marginTop: '.5rem' }}>
                <div className="m-dot" />
                <span className="m-url">healthwise.org</span>
                <span className="m-price">from $78</span>
                <span className="m-badge m-badge-verified">DA 65</span>
              </div>
              <div className="m-site-preview" style={{ marginTop: '.5rem' }}>
                <div className="m-dot" />
                <span className="m-url">financepulse.com</span>
                <span className="m-price">from $120</span>
                <span className="m-badge m-badge-verified">DA 58</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="m-stats-bar">
        <div className="m-container">
          <div className="m-stats-grid">
            <div className="m-stat-item">
              <div className="m-num">150,000+</div>
              <div className="m-desc">Unique websites</div>
            </div>
            <div className="m-stat-item">
              <div className="m-num">15,000+</div>
              <div className="m-desc">New sites added last month</div>
            </div>
            <div className="m-stat-item">
              <div className="m-num">45,000+</div>
              <div className="m-desc">Customer reviews</div>
            </div>
            <div className="m-stat-item">
              <div className="m-num">10,000+</div>
              <div className="m-desc">Active advertisers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHAT YOU GET ==================== */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-section-header">
            <h2>What You Get with Our Guest Posting Service</h2>
            <p>Everything you need to scale your content marketing and build authoritative backlinks that actually move the needle.</p>
          </div>
          <div className="m-cards-grid">
            <div className="m-feature-card">
              <div className="m-feature-icon">📊</div>
              <h3>Moz DA, Ahrefs DR, GA Traffic</h3>
              <p>Every site in our marketplace displays real Moz Domain Authority, Ahrefs Domain Rating, and verified Google Analytics traffic. No inflated numbers — just transparent, third-party metrics you can trust.</p>
            </div>
            <div className="m-feature-card">
              <div className="m-feature-icon">🔍</div>
              <h3>20+ Smart Filters</h3>
              <p>Filter by DA, DR, traffic, niche, language, country, price range, and more. Find the exact sites that match your target audience and SEO goals in seconds, not hours.</p>
            </div>
            <div className="m-feature-card">
              <div className="m-feature-icon">🛡️</div>
              <h3>Guaranteed Placements</h3>
              <p>Your content gets published or your money back. We maintain a 98.7% placement success rate across all orders, backed by our publisher quality guarantee.</p>
            </div>
            <div className="m-feature-card">
              <div className="m-feature-icon">✅</div>
              <h3>Automatic Content Verification</h3>
              <p>Once your article goes live, our system automatically verifies the placement — checking the link attributes, indexability, and content integrity so you don&apos;t have to.</p>
            </div>
            <div className="m-feature-card">
              <div className="m-feature-icon">🔒</div>
              <h3>Secure Choice of Websites</h3>
              <p>Browse detailed publisher profiles with verified metrics, real user reviews, and editorial guidelines. Make informed decisions with complete confidence.</p>
            </div>
            <div className="m-feature-card">
              <div className="m-feature-icon">💬</div>
              <h3>Prompt &amp; Quality Support</h3>
              <p>Our dedicated support team responds within 4 hours on average. Whether you need site recommendations or order assistance, we&apos;re here to help you succeed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TRUST STRIP ==================== */}
      <section className="m-trust-strip">
        <div className="m-container">
          <div className="m-trust-logos">
            <div className="m-trust-logo">🏆 G2 Leader</div>
            <div className="m-trust-logo">⭐ Trustpilot 4.7</div>
            <div className="m-trust-logo">🥇 SourceForge Top</div>
            <div className="m-trust-logo">✅ Crozdesk Verified</div>
          </div>
        </div>
      </section>

      {/* ==================== LIVE INVENTORY ==================== */}
      <section className="m-section m-bg-light">
        <div className="m-container">
          <div className="m-section-header">
            <h2>Choose Sites by Actual Metrics</h2>
            <p>Browse our live inventory of verified publisher sites. Every listing shows real, up-to-date SEO metrics pulled from Moz, Ahrefs, and Google Analytics.</p>
          </div>
          <div className="m-site-cards">
            {SITE_DATA.map((site) => (
              <div key={site.domain} className="m-site-card">
                <div className="m-site-card-header">
                  <span className="m-domain">{site.domain}</span>
                  <span className="m-badge m-badge-verified">Verified</span>
                  <span className="m-rating">⭐ {site.rating}</span>
                </div>
                <div className="m-site-badges">
                  <span className="m-badge m-badge-owner">{site.category}</span>
                  <span className="m-badge m-badge-contributor">{site.subCategory}</span>
                </div>
                <div className="m-metrics">
                  <div className="m-metric">
                    <div className="m-metric-label">Ahrefs DR</div>
                    <div className="m-metric-value">{site.dr}</div>
                  </div>
                  <div className="m-metric">
                    <div className="m-metric-label">Moz DA</div>
                    <div className="m-metric-value">{site.da}</div>
                  </div>
                  <div className="m-metric">
                    <div className="m-metric-label">Organic Traffic</div>
                    <div className="m-metric-value">{site.traffic}</div>
                  </div>
                  <div className="m-metric">
                    <div className="m-metric-label">Language</div>
                    <div className="m-metric-value">{site.language}</div>
                  </div>
                </div>
                <div className="m-pricing">
                  <div className="m-price-option">
                    <div className="m-price-label">Content Placement</div>
                    <div className="m-price-value">${site.contentPrice}</div>
                  </div>
                  <div className="m-price-option">
                    <div className="m-price-label">Writing &amp; Placement</div>
                    <div className="m-price-value">${site.writingPrice}</div>
                    <div className="m-price-tag">+${site.writingPrice - site.contentPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-text-center m-mt-2">
            <Link href="/buyer/catalog" className="m-btn m-btn-primary m-btn-lg">View All 150,000+ Sites →</Link>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-section-header">
            <h2>How It Works</h2>
            <p>Getting published on high-authority sites has never been this simple. Four easy steps to start building powerful backlinks today.</p>
          </div>
          <div className="m-steps-grid">
            <div className="m-step-card">
              <div className="m-step-num">1</div>
              <h3>Sign Up for Free</h3>
              <p>Create your account in under 60 seconds. No credit card required. Get instant access to our full marketplace of 150,000+ verified publisher sites.</p>
            </div>
            <div className="m-step-card">
              <div className="m-step-num">2</div>
              <h3>Filter &amp; Find Sites</h3>
              <p>Use 20+ smart filters to narrow down sites by DA, DR, traffic, niche, country, language, and budget. Find the perfect match for every campaign goal.</p>
            </div>
            <div className="m-step-card">
              <div className="m-step-num">3</div>
              <h3>Place Your Content</h3>
              <p>Upload your article and choose your target sites. Or let our professional writers craft SEO-optimized content tailored to each publication&apos;s audience.</p>
            </div>
            <div className="m-step-card">
              <div className="m-step-num">4</div>
              <h3>Get Published &amp; Track</h3>
              <p>Most articles go live within 3–7 business days. Track every placement in real-time through your dashboard. Automatic verification confirms your links are live and indexable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BENEFITS ==================== */}
      <section className="m-section m-bg-light">
        <div className="m-container">
          <div className="m-section-header">
            <h2>Enjoy Ultimate Perks</h2>
            <p>Why thousands of SEO professionals, agencies, and brands choose our platform to power their guest posting strategy.</p>
          </div>
          <div className="m-benefits-grid">
            <div className="m-benefit-item">
              <div className="m-benefit-icon">🌐</div>
              <div>
                <h3>150K+ Quality Sites</h3>
                <p>The largest base of platforms with clear metrics. Every site is manually vetted and displays real-time Moz DA, Ahrefs DR, and organic traffic data.</p>
              </div>
            </div>
            <div className="m-benefit-item">
              <div className="m-benefit-icon">📂</div>
              <div>
                <h3>50+ Categories</h3>
                <p>From business and finance to lifestyle and technology — find niche-relevant sites across every industry vertical. Content that belongs, not just content that ranks.</p>
              </div>
            </div>
            <div className="m-benefit-item">
              <div className="m-benefit-icon">🌍</div>
              <div>
                <h3>124+ Countries</h3>
                <p>Global reach across six continents. Target audiences in specific geographic markets or build a worldwide backlink profile that search engines love.</p>
              </div>
            </div>
            <div className="m-benefit-item">
              <div className="m-benefit-icon">🗣️</div>
              <div>
                <h3>40+ Languages</h3>
                <p>Publish in English, Spanish, German, French, Arabic, Japanese, and dozens more. Our marketplace spans native-language sites for authentic, localized outreach.</p>
              </div>
            </div>
            <div className="m-benefit-item">
              <div className="m-benefit-icon">⭐</div>
              <div>
                <h3>Real Feedback About Publishers</h3>
                <p>Know exactly who you work with. Read verified reviews from other advertisers, see detailed publisher profiles, and make data-driven decisions every time.</p>
              </div>
            </div>
            <div className="m-benefit-item">
              <div className="m-benefit-icon">💳</div>
              <div>
                <h3>Fair Payments</h3>
                <p>You&apos;re charged for successful tasks only. If a placement falls through, you don&apos;t pay. Transparent pricing with no hidden fees, no subscriptions, and no surprises.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== GEOGRAPHIC REACH ==================== */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-section-header">
            <h2>Fast-Growing International Platforms</h2>
            <p>Our publisher network spans the globe. Tap into high-authority sites in every major market for truly international SEO coverage.</p>
          </div>
          <div className="m-perks-grid">
            {COUNTRIES.map((c) => (
              <div key={c.code} className="m-perk-card">
                <div className="m-perk-icon">{c.flag}</div>
                <h3>{c.name}</h3>
                <p>{c.sites}+ sites</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LEAD MAGNET ==================== */}
      <section className="m-section m-bg-light">
        <div className="m-container">
          <div className="m-section-header">
            <h2>We Have a Free Gift for You</h2>
            <p>Sign up to receive an in-depth SEO Checklist covering everything you need to rank higher — absolutely free.</p>
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="m-landing-steps" style={{ marginBottom: '2rem' }}>
              <div className="m-landing-step">
                <div className="m-landing-icon">⚙️</div>
                <h3>Technical SEO</h3>
                <p>Site speed, crawlability, structured data, XML sitemaps, HTTPS, mobile-friendliness, and core web vitals optimization.</p>
              </div>
              <div className="m-landing-step">
                <div className="m-landing-icon">📝</div>
                <h3>On-Page SEO</h3>
                <p>Keyword research, title tags, meta descriptions, header hierarchy, internal linking, image optimization, and content quality guidelines.</p>
              </div>
              <div className="m-landing-step">
                <div className="m-landing-icon">🔗</div>
                <h3>Off-Page SEO</h3>
                <p>Backlink strategies, guest posting best practices, social signals, brand mentions, local citations, and link-building outreach templates.</p>
              </div>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '.75rem', maxWidth: 480, margin: '0 auto' }}>
              <div className="m-form-group" style={{ flex: 1, marginBottom: 0 }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ height: 48 }}
                />
              </div>
              <button type="submit" className="m-btn m-btn-primary m-btn-lg" style={{ whiteSpace: 'nowrap' }}>
                Get Free Checklist →
              </button>
            </form>
            <p className="m-consent-line m-mt-1">No spam, ever. Unsubscribe anytime. We respect your inbox.</p>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-section-header">
            <h2>What Our Clients Say</h2>
            <p>Join thousands of marketers who&apos;ve transformed their SEO results with our guest posting marketplace.</p>
            <div style={{ marginTop: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⭐</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--m-gray-900)' }}>4.9</span>
              <span style={{ color: 'var(--m-gray-500)', fontSize: '.875rem' }}>from 45,000+ reviews</span>
            </div>
          </div>
          <div className="m-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="m-testimonial-card">
                <div className="m-stars">⭐⭐⭐⭐⭐</div>
                <p className="m-testimonial-text">{t.text}</p>
                <div className="m-author">
                  <div className="m-avatar">{t.initials}</div>
                  <div>
                    <div className="m-author-name">{t.name}</div>
                    <div className="m-author-meta">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BLOG TEASER ==================== */}
      <section className="m-section m-bg-light">
        <div className="m-container">
          <div className="m-section-header">
            <h2>How Our Guest Blog Posting Platform Works</h2>
            <p>Learn SEO strategies, guest posting tips, and content marketing insights from our expert team.</p>
          </div>
          <div className="m-section-header m-left" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Latest from Our Blog</h3>
          </div>
          <div className="m-blog-grid">
            {BLOG_POSTS.map((post, i) => (
              <div key={i} className="m-blog-card">
                <div className="m-blog-img">{post.icon}</div>
                <div className="m-blog-body">
                  <div className="m-blog-category">{post.category}</div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="m-blog-meta">{post.date}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-text-center m-mt-2">
            <span className="m-btn m-btn-outline m-btn-lg">Read All Articles →</span>
          </div>
        </div>
      </section>

      {/* ==================== DOUBT RESOLVER ==================== */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-section-header">
            <h2>Still in Doubt?</h2>
            <p>We&apos;re here to help you make the right choice for your SEO strategy.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ background: 'var(--m-primary-light)', borderRadius: 'var(--m-radius-xl)', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📞</div>
              <h3 style={{ marginBottom: '.5rem' }}>Claim a Free Consultation</h3>
              <p style={{ color: 'var(--m-gray-500)', fontSize: '.925rem', marginBottom: '1.5rem' }}>Talk to our guest posting experts. We&apos;ll review your current backlink profile and recommend the best sites for your niche — no obligation.</p>
              <Link href="/signup" className="m-btn m-btn-primary m-btn-lg">Contact Us</Link>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--m-gray-200)', borderRadius: 'var(--m-radius-xl)', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ marginBottom: '.5rem' }}>Prefer to Figure It Out Yourself?</h3>
              <p style={{ color: 'var(--m-gray-500)', fontSize: '.925rem', marginBottom: '1.5rem' }}>Browse our comprehensive FAQ covering pricing, placements, metrics, and everything else you&apos;d want to know before getting started.</p>
              <span className="m-btn m-btn-outline m-btn-lg">Jump to FAQ →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Join 10,000+ marketers who are already building powerful backlinks on our platform. Create your free account in seconds.</p>
            <div className="m-cta-actions">
              <Link href="/signup" className="m-btn m-btn-white m-btn-lg" style={{ height: 48 }}>Get Started Free</Link>
            </div>
            <div className="m-cta-actions m-mt-1" style={{ marginTop: '1.5rem' }}>
              <span style={{ color: 'rgba(255,255,255,.6)', fontSize: '.8125rem' }}>Or sign up with</span>
              <button className="m-btn m-btn-google m-btn-sm" disabled>Google</button>
              <button className="m-btn m-btn-facebook m-btn-sm" disabled>Facebook</button>
            </div>
            <p className="m-consent-line m-mt-1" style={{ color: 'rgba(255,255,255,.5)', maxWidth: 420, margin: '1rem auto 0' }}>
              By signing up, you agree to our Terms of Service and Privacy Policy. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="m-footer">
        <div className="m-container">
          <div className="m-footer-grid">
            <div className="m-footer-col">
              <h4>Guest Posting</h4>
              <Link href="/buyer/catalog">Technology Guest Post</Link>
              <Link href="/buyer/catalog">Finance Guest Post</Link>
              <Link href="/buyer/catalog">Health Guest Post</Link>
              <Link href="/buyer/catalog">Business Guest Post</Link>
              <Link href="/buyer/catalog">Travel Guest Post</Link>
              <Link href="/buyer/catalog">Lifestyle Guest Post</Link>
              <Link href="/buyer/catalog">Real Estate Guest Post</Link>
            </div>
            <div className="m-footer-col">
              <h4>Backlink Services</h4>
              <Link href="/buyer/catalog">Buy Backlinks</Link>
              <Link href="/buyer/catalog">Quality Backlinks</Link>
              <Link href="/buyer/catalog">SEO Backlinks</Link>
              <Link href="/buyer/catalog">DoFollow Backlinks</Link>
              <Link href="/buyer/catalog">Niche Edits</Link>
              <Link href="/buyer/catalog">Link Insertion</Link>
            </div>
            <div className="m-footer-col">
              <h4>Platform</h4>
              <Link href="/buyer/catalog">For Brands</Link>
              <Link href="/buyer/catalog">For Agencies</Link>
              <Link href="/publisher">For Publishers</Link>
              <span>FAQ</span>
              <span>Blog</span>
              <span>API Service</span>
              <span>Referral Program</span>
            </div>
            <div className="m-footer-col">
              <h4>Company</h4>
              <span>About Us</span>
              <span>Contact</span>
              <span>Terms &amp; Conditions</span>
              <span>Privacy Policy</span>
              <span>Managed Services</span>
            </div>
          </div>
          <div className="m-footer-bottom">
            <div>&copy; 2026 GuestPost Marketplace. All rights reserved.</div>
            <div className="m-footer-social">
              <span>📱</span><span>💬</span><span>📘</span><span>🐦</span><span>▶️</span>
            </div>
            <div className="m-payment-icons">
              <span>Visa</span><span>MC</span><span>Amex</span><span>PayPal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// === DATA ===

const SITE_DATA = [
  { domain: 'techinsider.com', category: 'Technology', subCategory: 'SaaS', rating: '4.8', dr: 68, da: 72, traffic: '245K/mo', language: 'English', contentPrice: 95, writingPrice: 115 },
  { domain: 'healthwise.org', category: 'Health', subCategory: 'Wellness', rating: '4.7', dr: 60, da: 65, traffic: '180K/mo', language: 'English', contentPrice: 78, writingPrice: 92 },
  { domain: 'financepulse.com', category: 'Finance', subCategory: 'Investing', rating: '4.9', dr: 54, da: 58, traffic: '320K/mo', language: 'English', contentPrice: 120, writingPrice: 145 },
  { domain: 'travelvista.com', category: 'Travel', subCategory: 'Destinations', rating: '4.6', dr: 50, da: 55, traffic: '95K/mo', language: 'English', contentPrice: 65, writingPrice: 78 },
  { domain: 'bizgrowth.com', category: 'Business', subCategory: 'Entrepreneurship', rating: '4.5', dr: 44, da: 48, traffic: '62K/mo', language: 'English', contentPrice: 52, writingPrice: 63 },
  { domain: 'lifestylehub.com', category: 'Lifestyle', subCategory: 'Home & Living', rating: '4.4', dr: 38, da: 42, traffic: '41K/mo', language: 'English', contentPrice: 35, writingPrice: 45 },
];

const COUNTRIES = [
  { code: 'US', flag: '🇺🇸', name: 'United States', sites: '45,000' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada', sites: '8,200' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', sites: '12,500' },
  { code: 'ES', flag: '🇪🇸', name: 'Spain', sites: '6,800' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany', sites: '9,100' },
  { code: 'FR', flag: '🇫🇷', name: 'France', sites: '7,300' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia', sites: '5,600' },
  { code: 'AE', flag: '🇦🇪', name: 'UAE', sites: '3,200' },
];

const TESTIMONIALS = [
  { initials: 'MS', name: 'Marcus Sterling', role: 'SEO Director, GrowthLabs Agency', text: 'This platform completely changed our link-building workflow. We used to spend weeks emailing site owners. Now we find, filter, and place content on high-DA sites in one afternoon. The verified metrics give us complete confidence.' },
  { initials: 'RK', name: 'Rebecca Kowalski', role: 'Head of Marketing, Verde Home Goods', text: 'As an e-commerce brand, editorial backlinks were always our biggest challenge. This marketplace gave us access to real blogs in our niche at predictable prices. Our organic traffic grew 340% in 8 months.' },
  { initials: 'JT', name: 'James Thornton', role: 'Founder, PeakRank Digital', text: 'We manage SEO for 40+ clients. This tool has been an absolute lifesaver. The ability to filter by niche, DA, and budget lets us build custom backlink packages for every client without ever compromising on quality.' },
  { initials: 'AP', name: 'Aisha Patel', role: 'Content Strategist, Freelance', text: 'I was skeptical about guest posting marketplaces at first, but the transparency here won me over. Real DR, real traffic numbers, and real results. My domain rating jumped from 18 to 41 in six months.' },
];

const BLOG_POSTS = [
  { icon: '🔍', category: 'SEO', title: 'The Ultimate SEO Migration Checklist: 11 Steps to Protect Your Rankings', excerpt: 'Site migrations are one of the riskiest moments for organic traffic. Follow this 11-step checklist to avoid ranking drops and ensure a smooth transition.', date: 'August 5, 2026' },
  { icon: '📈', category: 'Analytics', title: 'Average Bounce Rate Benchmarks: 92 Statistics for 2026', excerpt: 'What\'s a good bounce rate? We analyzed data across 16 industries to give you the most comprehensive bounce rate benchmarks available.', date: 'July 28, 2026' },
  { icon: '📋', category: 'Case Study', title: 'Case Study: How Fello Grew DR 12 to 29 with Strategic Guest Posting', excerpt: 'See how a fintech startup used targeted guest posting to nearly triple their domain rating and capture competitive keywords in under 12 months.', date: 'July 19, 2026' },
  { icon: '🎙️', category: 'Marketing', title: 'How to Promote a Podcast: A Step-by-Step Growth System', excerpt: 'Building a podcast audience takes more than great audio. Learn the distribution, SEO, and outreach system that top podcasters use to grow.', date: 'July 12, 2026' },
];
