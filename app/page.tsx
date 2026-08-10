export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';

export default function HomePage() {
  // ── Auth check ──────────────────────────────────────────────────────
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (sessionToken) {
    const user = getSession(sessionToken);
    if (user) {
      // Redirect based on role
      if (user.role === 'buyer') redirect('/buyer/dashboard');
      if (user.role === 'publisher') redirect('/publisher/dashboard');
      if (user.role === 'admin') redirect('/admin/dashboard');
    }
  }

  // ── DB stats ────────────────────────────────────────────────────────
  let siteCount = 0;
  let orderCount = 0;
  try {
    const db = getDb();
    const sc = db.prepare('SELECT COUNT(*) as count FROM sites WHERE status = ?').get('approved') as any;
    siteCount = sc?.count || 0;
    const oc = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    orderCount = oc?.count || 0;
  } catch {
    // DB may not be available during build; fall back gracefully
  }

  // ── Landing page ────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
          color: 'white',
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1rem',
            }}
          >
            Guest Posts on 150,000+ Real Websites
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.85)',
              marginBottom: '2rem',
            }}
          >
            Place your content on high-authority sites with verified SEO metrics.
            The marketplace trusted by agencies, brands, and publishers worldwide.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '.75rem 2rem',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '1rem',
                background: 'white',
                color: '#2563eb',
                textDecoration: 'none',
                border: '2px solid transparent',
              }}
            >
              Get Started Free
            </a>
            <a
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '.75rem 2rem',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '1rem',
                background: 'transparent',
                color: 'white',
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.4)',
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section
        style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '2rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#2563eb',
                lineHeight: 1.2,
              }}
            >
              {siteCount.toLocaleString()}+
            </div>
            <div style={{ fontSize: '.875rem', color: '#64748b', marginTop: '.25rem' }}>
              Verified Websites
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#2563eb',
                lineHeight: 1.2,
              }}
            >
              {orderCount.toLocaleString()}+
            </div>
            <div style={{ fontSize: '.875rem', color: '#64748b', marginTop: '.25rem' }}>
              Orders Placed
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#2563eb',
                lineHeight: 1.2,
              }}
            >
              98%
            </div>
            <div style={{ fontSize: '.875rem', color: '#64748b', marginTop: '.25rem' }}>
              Satisfaction Rate
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#2563eb',
                lineHeight: 1.2,
              }}
            >
              24h
            </div>
            <div style={{ fontSize: '.875rem', color: '#64748b', marginTop: '.25rem' }}>
              Avg Turnaround
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '4rem 1.5rem',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '3rem',
          }}
        >
          How It Works
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
          }}
        >
          {[
            {
              step: '01',
              title: 'Browse Sites',
              desc: 'Search and filter through thousands of websites by niche, DA/DR, traffic, and price.',
              color: '#2563eb',
            },
            {
              step: '02',
              title: 'Place an Order',
              desc: 'Choose content placement or writing service. Provide your content or let us write it.',
              color: '#7c3aed',
            },
            {
              step: '03',
              title: 'Get Published',
              desc: 'Track your order from draft to published. Receive the live link once it goes live.',
              color: '#059669',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="card"
              style={{ textAlign: 'center', padding: '2rem 1.5rem' }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: item.color,
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                {item.step}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '.5rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '.875rem', color: '#64748b', lineHeight: 1.65 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── For buyers & publishers ───────────────────────────── */}
      <section
        style={{
          background: '#f8fafc',
          padding: '4rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Buyers card */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '2.5rem 2rem',
            }}
          >
            <div
              style={{
                fontSize: '2rem',
                marginBottom: '1rem',
              }}
            >
              🛒
            </div>
            <h3
              style={{
                fontSize: '1.375rem',
                fontWeight: 700,
                marginBottom: '.75rem',
              }}
            >
              For Buyers
            </h3>
            <p
              style={{
                fontSize: '.925rem',
                color: '#64748b',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              Browse verified publisher sites, compare metrics, place orders, and track
              publication — all in one dashboard. Find the perfect sites for your backlink
              strategy.
            </p>
            <a href="/signup" className="btn btn-primary btn-lg">
              Start as Buyer
            </a>
          </div>

          {/* Publishers card */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              padding: '2.5rem 2rem',
            }}
          >
            <div
              style={{
                fontSize: '2rem',
                marginBottom: '1rem',
              }}
            >
              📰
            </div>
            <h3
              style={{
                fontSize: '1.375rem',
                fontWeight: 700,
                marginBottom: '.75rem',
              }}
            >
              For Publishers
            </h3>
            <p
              style={{
                fontSize: '.925rem',
                color: '#64748b',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              List your sites, set your prices, receive orders, and earn revenue from guest
              posts and link insertions. Simple, transparent, and profitable.
            </p>
            <a href="/signup" className="btn btn-primary btn-lg">
              Start as Publisher
            </a>
          </div>
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '.5rem',
          }}
        >
          Why Choose GuestPost Marketplace?
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '1.05rem',
            marginBottom: '3rem',
          }}
        >
          Everything you need for effective digital PR and link building
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            {
              icon: '🔍',
              title: 'Verified Metrics',
              desc: 'Every site shows real Moz DA, Ahrefs DR, organic traffic, and spam score — no inflated numbers.',
            },
            {
              icon: '⚡',
              title: 'Fast Turnaround',
              desc: 'Average delivery in 3 days. Track every order from draft to live publication in real time.',
            },
            {
              icon: '🛡️',
              title: 'Secure Payments',
              desc: 'Funds held in escrow until publication confirmed. Full buyer and publisher protection.',
            },
            {
              icon: '🌍',
              title: 'Global Sites',
              desc: 'Websites across dozens of countries and languages. Target any market you need.',
            },
            {
              icon: '📊',
              title: 'Detailed Analytics',
              desc: 'Track spending, placements, and performance. Export reports for clients and stakeholders.',
            },
            {
              icon: '🤝',
              title: 'Dedicated Support',
              desc: 'Priority support for agencies and brands. Dedicated account managers for high-volume buyers.',
            },
          ].map((f) => (
            <div key={f.title} className="card">
              <div style={{ fontSize: '1.5rem', marginBottom: '.75rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '.875rem', color: '#64748b', lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '4rem 1.5rem',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            marginBottom: '.75rem',
          }}
        >
          Ready to scale your SEO?
        </h2>
        <p
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '2rem',
            maxWidth: 560,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Join thousands of agencies and brands already using GuestPost Marketplace.
        </p>
        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '.75rem 2rem',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: '1rem',
              background: 'white',
              color: '#2563eb',
              textDecoration: 'none',
            }}
          >
            Create Free Account
          </a>
          <a
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '.75rem 2rem',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: '1rem',
              background: 'transparent',
              color: 'white',
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.4)',
            }}
          >
            Sign In
          </a>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        style={{
          background: '#0f172a',
          color: '#94a3b8',
          textAlign: 'center',
          padding: '2rem 1.5rem',
          fontSize: '.8125rem',
        }}
      >
        <p>&copy; {new Date().getFullYear()} GuestPost Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}
