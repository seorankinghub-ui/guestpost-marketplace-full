'use client';

import { useState, useEffect, FormEvent } from 'react';

const styles: Record<string, React.CSSProperties> = {
  pageTitle: { fontSize: 26, fontWeight: 700, color: '#1a202c', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20, overflow: 'hidden' },
  cardHeader: { padding: '16px 20px', borderBottom: '1px solid #edf2f7' },
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#2d3748' },
  cardBody: { padding: 20 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#2d3748', boxSizing: 'border-box' as const },
  readOnlyInput: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, color: '#a0aec0', backgroundColor: '#f7fafc', boxSizing: 'border-box' as const },
  row: { display: 'flex', gap: 16 },
  half: { flex: 1 },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #edf2f7' },
  checkboxLabel: { fontSize: 13, color: '#4a5568' },
  termsBox: { padding: 14, backgroundColor: '#f0fff4', borderRadius: 6, border: '1px solid #c6f6d5', fontSize: 13, color: '#22543d', marginTop: 8 },
  saveBtn: { padding: '10px 22px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  success: { padding: '10px 16px', backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 6, color: '#22543d', fontSize: 13, marginBottom: 16 },
  error: { padding: '10px 16px', backgroundColor: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 6, color: '#c53030', fontSize: 13, marginBottom: 16 },
};

export default function PublisherSettings() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const u = data.user;
          setProfile({ name: u.name, email: u.email });
          setPaypalEmail(u.paypal_email || '');
          setUsdtAddress(u.usdt_address || '');
          setTermsAccepted(!!u.publisher_terms_accepted);
        }
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypal_email: paypalEmail,
          usdt_address: usdtAddress,
        }),
      });
      if (res.ok) setMessage('Settings saved successfully.');
      else throw new Error();
    } catch {
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 40, color: '#718096' }}>Loading...</div>;

  return (
    <div>
      <h1 style={styles.pageTitle}>Settings</h1>

      {message && (
        <div style={message.includes('Error') ? styles.error : styles.success}>{message}</div>
      )}

      {/* Profile */}
      <div style={styles.card}>
        <div style={styles.cardHeader}><div style={styles.cardTitle}>Profile</div></div>
        <div style={styles.cardBody}>
          <div style={styles.row}>
            <div style={{ ...styles.field, ...styles.half }}>
              <label style={styles.label}>Name</label>
              <input style={styles.readOnlyInput} value={profile.name} disabled />
            </div>
            <div style={{ ...styles.field, ...styles.half }}>
              <label style={styles.label}>Email</label>
              <input style={styles.readOnlyInput} value={profile.email} disabled />
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#a0aec0' }}>Contact support to change your name or email.</div>
        </div>
      </div>

      {/* Payment Details */}
      <div style={styles.card}>
        <div style={styles.cardHeader}><div style={styles.cardTitle}>Payment Details</div></div>
        <div style={styles.cardBody}>
          <div style={styles.field}>
            <label style={styles.label}>PayPal Email</label>
            <input style={styles.input} value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>USDT Address (TRC20)</label>
            <input style={styles.input} value={usdtAddress} onChange={e => setUsdtAddress(e.target.value)} placeholder="T..." />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div style={styles.card}>
        <div style={styles.cardHeader}><div style={styles.cardTitle}>Notification Preferences</div></div>
        <div style={styles.cardBody}>
          <div style={styles.checkboxRow}>
            <input type="checkbox" checked={emailNotifs} onChange={e => setEmailNotifs(e.target.checked)} />
            <span style={styles.checkboxLabel}>Email notifications</span>
          </div>
          <div style={{ ...styles.checkboxRow, borderBottom: 'none' }}>
            <input type="checkbox" checked={orderNotifs} onChange={e => setOrderNotifs(e.target.checked)} />
            <span style={styles.checkboxLabel}>New order notifications</span>
          </div>
        </div>
      </div>

      {/* Publisher Terms */}
      <div style={styles.card}>
        <div style={styles.cardHeader}><div style={styles.cardTitle}>Publisher Terms</div></div>
        <div style={styles.cardBody}>
          {termsAccepted ? (
            <div style={styles.termsBox}>
              ✅ You have accepted the publisher terms and conditions. Status: Active Publisher
            </div>
          ) : (
            <div style={{ padding: 14, backgroundColor: '#fffff0', borderRadius: 6, border: '1px solid #faf089', fontSize: 13, color: '#975a16' }}>
              ⚠️ You need to accept the publisher terms before your sites can be listed.
              <br /><a href="#" style={{ color: '#3182ce', fontWeight: 600 }}>Review Publisher Terms →</a>
            </div>
          )}
        </div>
      </div>

      <button style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
