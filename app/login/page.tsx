'use client';

import { useState, FormEvent } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
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
            Welcome Back
          </h1>
          <p style={{ fontSize: '.875rem', color: '#64748b', marginTop: '.25rem' }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            style={{ marginTop: '.5rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        {/* Social buttons (disabled for now) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          <button type="button" className="social-btn btn-disabled" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
            <span className="badge badge-gray" style={{ marginLeft: 'auto' }}>
              Soon
            </span>
          </button>

          <button type="button" className="social-btn btn-disabled" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
            <span className="badge badge-gray" style={{ marginLeft: 'auto' }}>
              Soon
            </span>
          </button>
        </div>

        {/* Sign up link */}
        <p style={{ textAlign: 'center', fontSize: '.875rem', color: '#64748b', marginTop: '1.5rem' }}>
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            style={{
              color: '#2563eb',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
