'use client';
import { useState } from 'react';
import { ArrowRight } from './Icons';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j.success === false) throw new Error(j.message || 'Could not subscribe right now');
      setMsg({ ok: true, text: 'Thanks for subscribing!' }); setEmail('');
    } catch (err) { setMsg({ ok: false, text: err.message }); } finally { setBusy(false); }
  }
  return (
    <form className="news" onSubmit={submit}>
      <label htmlFor="news-email" className="news__label">Subscribe to our emails</label>
      <div className="news__field">
        <input id="news-email" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" disabled={busy} aria-label="Subscribe"><ArrowRight /></button>
      </div>
      {msg && <p className={msg.ok ? 'news__ok' : 'news__err'} role="status">{msg.text}</p>}
    </form>
  );
}
