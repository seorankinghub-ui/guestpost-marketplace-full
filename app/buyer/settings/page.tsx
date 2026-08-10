'use client';

import { useEffect, useState } from 'react';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  paypal_email: string | null;
  usdt_address: string | null;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [wppNotifs, setWppNotifs] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');

  // Payment
  const [paypalEmail, setPaypalEmail] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');
  const [paymentMsg, setPaymentMsg] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else {
          setProfile(data.user);
          setPaypalEmail(data.user.paypal_email || '');
          setUsdtAddress(data.user.usdt_address || '');
        }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load profile'); setLoading(false); });
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordMsg('Please fill in all fields');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    setChangingPassword(true);
    setPasswordMsg('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordMsg(data.error || 'Failed to change password');
      } else {
        setPasswordMsg('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordMsg('Network error. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleNotifSave = async () => {
    setNotifMsg('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_notifications: emailNotifs, whatsapp_notifications: wppNotifs }),
      });
      const data = await res.json();
      if (!res.ok) setNotifMsg(data.error || 'Failed to save');
      else setNotifMsg('Notification preferences saved!');
    } catch {
      setNotifMsg('Network error');
    }
  };

  const handlePaymentSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPayment(true);
    setPaymentMsg('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paypal_email: paypalEmail, usdt_address: usdtAddress }),
      });
      const data = await res.json();
      if (!res.ok) setPaymentMsg(data.error || 'Failed to save');
      else setPaymentMsg('Payment details saved!');
    } catch {
      setPaymentMsg('Network error');
    } finally {
      setSavingPayment(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading settings...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>;
  if (!profile) return null;

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '.25rem' }}>Settings</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Manage your account settings and preferences.
      </p>

      {/* Profile Info */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Profile Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '.75rem', color: '#64748b', marginBottom: '.25rem' }}>Name</div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{profile.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '.75rem', color: '#64748b', marginBottom: '.25rem' }}>Email</div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: '#2563eb' }}>{profile.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '.75rem', color: '#64748b', marginBottom: '.25rem' }}>Role</div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>
              <span style={{
                display: 'inline-block', padding: '.15rem .6rem', borderRadius: 12,
                background: '#eff6ff', color: '#2563eb', fontSize: '.8rem'
              }}>
                {profile.role}
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '.75rem', color: '#64748b', marginBottom: '.25rem' }}>Account ID</div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: '#94a3b8' }}>#{profile.id}</div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Change Password</h2>
        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', maxWidth: 400 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#64748b' }}>Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
              style={{ padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#64748b' }}>New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              style={{ padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#64748b' }}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              style={{ padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem' }} />
          </div>
          <button type="submit" disabled={changingPassword} style={{
            padding: '.6rem 1.25rem', background: changingPassword ? '#94a3b8' : '#2563eb', color: 'white',
            border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '.85rem', cursor: changingPassword ? 'default' : 'pointer',
            alignSelf: 'flex-start'
          }}>
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
          {passwordMsg && (
            <div style={{
              padding: '.5rem .75rem', borderRadius: 6, fontSize: '.85rem',
              background: passwordMsg.includes('successfully') ? '#f0fdf4' : '#fef2f2',
              color: passwordMsg.includes('successfully') ? '#10b981' : '#ef4444'
            }}>
              {passwordMsg}
            </div>
          )}
        </form>
      </div>

      {/* Notification Preferences */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Notification Preferences</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={emailNotifs} onChange={e => setEmailNotifs(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#2563eb' }} />
            <div>
              <div style={{ fontWeight: 500 }}>Email Notifications</div>
              <div style={{ fontSize: '.8rem', color: '#64748b' }}>Receive order updates via email</div>
            </div>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={wppNotifs} onChange={e => setWppNotifs(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#2563eb' }} />
            <div>
              <div style={{ fontWeight: 500 }}>WhatsApp Notifications</div>
              <div style={{ fontSize: '.8rem', color: '#64748b' }}>Receive urgent updates via WhatsApp</div>
            </div>
          </label>
          <button onClick={handleNotifSave} style={{
            padding: '.5rem 1.25rem', background: '#2563eb', color: 'white',
            border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '.85rem', cursor: 'pointer',
            alignSelf: 'flex-start'
          }}>
            Save Preferences
          </button>
          {notifMsg && (
            <div style={{
              padding: '.5rem .75rem', borderRadius: 6, fontSize: '.85rem',
              background: notifMsg.includes('saved') ? '#f0fdf4' : '#fef2f2',
              color: notifMsg.includes('saved') ? '#10b981' : '#ef4444'
            }}>
              {notifMsg}
            </div>
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Payment Details</h2>
        <form onSubmit={handlePaymentSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 500 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#64748b' }}>PayPal Email</label>
            <input type="email" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#64748b' }}>USDT Wallet Address (TRC-20)</label>
            <input type="text" value={usdtAddress} onChange={e => setUsdtAddress(e.target.value)}
              placeholder="TYourUSDTAddressHere..."
              style={{ padding: '.6rem .75rem', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '.9rem' }} />
          </div>
          <button type="submit" disabled={savingPayment} style={{
            padding: '.6rem 1.25rem', background: savingPayment ? '#94a3b8' : '#2563eb', color: 'white',
            border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '.85rem', cursor: savingPayment ? 'default' : 'pointer',
            alignSelf: 'flex-start'
          }}>
            {savingPayment ? 'Saving...' : 'Save Payment Details'}
          </button>
          {paymentMsg && (
            <div style={{
              padding: '.5rem .75rem', borderRadius: 6, fontSize: '.85rem',
              background: paymentMsg.includes('saved') ? '#f0fdf4' : '#fef2f2',
              color: paymentMsg.includes('saved') ? '#10b981' : '#ef4444'
            }}>
              {paymentMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
