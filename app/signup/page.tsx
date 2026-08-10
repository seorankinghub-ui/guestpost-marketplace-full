'use client';

import { useState, FormEvent } from 'react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'publisher' | ''>('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = 'Name is required.';
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (!role) errors.role = 'Please select a role.';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }

      // Store session token as client-readable cookie
      document.cookie = `session_token=${data.token}; path=/; max-age=86400`;

      // Redirect based on role
      if (data.user?.role === 'buyer') window.location.href = '/buyer/dashboard';
      else if (data.user?.role === 'publisher') window.location.href = '/publisher/dashboard';
      else if (data.user?.role === 'admin') window.location.href = '/admin/dashboard';
      else window.location.href = '/';
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#2563eb',
              marginBottom: '.25rem',
            }}
          >
            GuestPost
          </div>
          <h1
            style={{
              fontSize: '1.375rem',
              fontWeight: 700,
              color: '#1e293b',
            }}
          >
            Create Your Account
          </h1>
          <p style={{ fontSize: '.875rem', color: '#64748b', marginTop: '.25rem' }}>
            Join the marketplace — it takes less than a minute
          </p>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className={`form-input${fieldErrors.name ? ' error' : ''}`}
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              autoFocus
            />
            {fieldErrors.name && <div className="form-error">{fieldErrors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`form-input${fieldErrors.email ? ' error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`form-input${fieldErrors.password ? ' error' : ''}`}
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
          </div>

          {/* Role selector */}
          <div className="form-group">
            <label>I am a…</label>
            <div className="role-select">
              <div
                className={`role-card${role === 'buyer' ? ' selected' : ''}`}
                onClick={() => { setRole('buyer'); setFieldErrors((e) => { const { role: _, ...rest } = e; return rest; }); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setRole('buyer'); } }}
              >
                <div className="role-icon">🛒</div>
                <div className="role-label">Buyer</div>
                <div className="role-desc">
                  I want to buy guest posts and backlinks
                </div>
              </div>

              <div
                className={`role-card${role === 'publisher' ? ' selected' : ''}`}
                onClick={() => { setRole('publisher'); setFieldErrors((e) => { const { role: _, ...rest } = e; return rest; }); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setRole('publisher'); } }}
              >
                <div className="role-icon">📰</div>
                <div className="role-label">Publisher</div>
                <div className="role-desc">
                  I own websites and want to sell placements
                </div>
              </div>
            </div>
            {fieldErrors.role && <div className="form-error" style={{ marginTop: '.25rem' }}>{fieldErrors.role}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            style={{ marginTop: '.25rem' }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '.875rem',
            color: '#64748b',
            marginTop: '1.5rem',
          }}
        >
          Already have an account?{' '}
          <a
            href="/login"
            style={{
              color: '#2563eb',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
