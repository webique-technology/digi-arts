'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminFetch, imageUrl } from '@/lib/api';
import { useAdmin } from './AdminProvider';
import { SingleImage } from './ImageDropzone';

export default function BannerForm({ banner }) {
  const router = useRouter();
  const { toast, onError } = useAdmin();
  const [f, setF] = useState({
    title: banner?.title || '', subtitle: banner?.subtitle || '', link_url: banner?.link_url || '',
    sort_order: banner?.sort_order ?? 0, status: String(banner?.status ?? 1),
    start_date: banner?.start_date || '', end_date: banner?.end_date || '',
  });
  const [desk, setDesk] = useState({ file: null, url: banner ? imageUrl(banner.image_desktop) : '' });
  const [mob, setMob] = useState({ file: null, url: banner?.image_mobile ? imageUrl(banner.image_mobile) : '', removed: false });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(ev) {
    ev.preventDefault();
    const e = {};
    if (!f.title.trim()) e.title = 'Title is required';
    if (!desk.url) e.image_desktop = 'Desktop image is required';
    if (f.start_date && f.end_date && f.end_date < f.start_date) e.end_date = 'End date must be after start date';
    setErrors(e); if (Object.keys(e).length) return;

    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => fd.append(k, v));
    if (desk.file) fd.append('image_desktop', desk.file);
    if (mob.file) fd.append('image_mobile', mob.file);
    if (mob.removed && !mob.file) fd.append('remove_mobile', '1');

    setBusy(true);
    try {
      await adminFetch(banner ? `/admin/banners/${banner.id}` : '/admin/banners', { method: 'POST', body: fd });
      toast(banner ? 'Banner updated' : 'Banner created');
      router.push('/admin/banners');
    } catch (err) {
      if (err.status === 422 && err.errors) setErrors(err.errors);
      onError(err);
    } finally { setBusy(false); }
  }

  const Err = ({ k }) => (errors[k] ? <div className="field__error">{errors[k]}</div> : null);

  return (
    <form className="panel" onSubmit={submit} noValidate>
      <div className="panel__head"><h1>{banner ? 'Edit banner' : 'Add banner'}</h1><Link href="/admin/banners" className="btn btn--outline btn--sm">← Back</Link></div>
      <div className="form-grid">
        <div className="field"><label htmlFor="b-title">Title *</label><input id="b-title" value={f.title} onChange={set('title')} /><Err k="title" /></div>
        <div className="field"><label htmlFor="b-sub">Subtitle</label><input id="b-sub" value={f.subtitle} onChange={set('subtitle')} /></div>
        <div className="field"><label htmlFor="b-link">Link URL</label><input id="b-link" value={f.link_url} onChange={set('link_url')} placeholder="/products" /></div>
        <div className="field"><label htmlFor="b-order">Sort order</label><input id="b-order" type="number" value={f.sort_order} onChange={set('sort_order')} /></div>
        <div className="field"><label htmlFor="b-status">Status</label>
          <select id="b-status" value={f.status} onChange={set('status')}><option value="1">Active</option><option value="0">Inactive</option></select></div>
        <div />
        <div className="field"><label htmlFor="b-start">Start date</label><input id="b-start" type="date" value={f.start_date} onChange={set('start_date')} /></div>
        <div className="field"><label htmlFor="b-end">End date</label><input id="b-end" type="date" value={f.end_date} onChange={set('end_date')} /><Err k="end_date" /></div>
        <div className="full"><SingleImage label="Desktop image * (recommended 1920×700)" url={desk.url} aspect="16 / 6" maxMB={3}
          onFile={(file, url) => setDesk({ file, url })} onReject={(m) => toast(m, 'error')} error={errors.image_desktop} /></div>
        <div className="full"><SingleImage label="Mobile image (recommended 800×1000)" url={mob.url} aspect="4 / 5" maxMB={3}
          onFile={(file, url) => setMob({ file, url, removed: false })} onClear={() => setMob({ file: null, url: '', removed: true })} onReject={(m) => toast(m, 'error')} /></div>
      </div>
      <button className="btn" disabled={busy}>{busy ? 'Saving…' : banner ? 'Update banner' : 'Create banner'}</button>
    </form>
  );
}
