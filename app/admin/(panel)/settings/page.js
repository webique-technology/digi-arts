'use client';
import { useState } from 'react';
import { adminFetch } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import FormField from '@/components/FormField';

export default function Settings() {
  const { admin, toast, onError } = useAdmin();
  const [f, setF] = useState({ current_password: '', new_password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (!f.current_password) er.current_password = 'Enter your current password';
    if (f.new_password.length < 8) er.new_password = 'Use at least 8 characters';
    if (f.new_password !== f.confirm) er.confirm = 'Passwords do not match';
    setErrors(er); if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await adminFetch('/admin/password', { method: 'POST', body: { current_password: f.current_password, new_password: f.new_password } });
      toast('Password updated'); setF({ current_password: '', new_password: '', confirm: '' });
    } catch (err) { if (err.status === 422 && err.errors) setErrors(err.errors); else onError(err); } finally { setBusy(false); }
  }
  return (
    <div className="panel" style={{ maxWidth: 520 }}>
      <h1>Settings</h1>
      <p style={{ margin: '8px 0 20px', color: '#666' }}>Signed in as <strong>{admin.name}</strong> (+91 {admin.phone})</p>
      <form onSubmit={submit} noValidate>
        <h2 style={{ marginBottom: 12 }}>Change password</h2>
        <FormField id="current_password" type="password" label="Current password" value={f.current_password} onChange={set('current_password')} error={errors.current_password} autoComplete="current-password" />
        <FormField id="new_password" type="password" label="New password" value={f.new_password} onChange={set('new_password')} error={errors.new_password} autoComplete="new-password" />
        <FormField id="confirm" type="password" label="Confirm new password" value={f.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Update password'}</button>
      </form>
    </div>
  );
}
