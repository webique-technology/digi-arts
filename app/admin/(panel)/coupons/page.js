'use client';
import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAdmin } from '@/components/admin/AdminProvider';
import ConfirmModal from '@/components/admin/ConfirmModal';
import FormField from '@/components/FormField';

const BLANK = { code: '', type: 'percent', value: '', min_order: '', max_discount: '', usage_limit: '', expires_at: '', status: '1' };

export default function AdminCoupons() {
  const { toast, onError } = useAdmin();
  const [rows, setRows] = useState(null);
  const [f, setF] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState(null);
  const set = (k) => (e) => { setF((s) => ({ ...s, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })); };

  const load = useCallback(() => adminFetch('/admin/coupons').then((r) => setRows(r.data || [])).catch(onError), [onError]);
  useEffect(() => { load(); }, [load]);

  const edit = (c) => {
    setEditId(c.id); setErrors({});
    setF({ code: c.code, type: c.type, value: String(c.value), min_order: c.min_order ? String(c.min_order) : '', max_discount: c.max_discount != null ? String(c.max_discount) : '',
      usage_limit: c.usage_limit != null ? String(c.usage_limit) : '', expires_at: c.expires_at || '', status: String(c.status) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reset = () => { setEditId(null); setF(BLANK); setErrors({}); };

  async function save(e) {
    e.preventDefault(); setBusy(true); setErrors({});
    try {
      const body = { ...f, code: f.code.trim().toUpperCase() };
      if (editId) await adminFetch(`/admin/coupons/${editId}`, { method: 'PUT', body });
      else await adminFetch('/admin/coupons', { method: 'POST', body });
      toast(editId ? 'Coupon updated' : 'Coupon created'); reset(); load();
    } catch (err) { if (err.status === 422 && err.errors) setErrors(err.errors); else onError(err); } finally { setBusy(false); }
  }
  const toggle = async (c) => { try { await adminFetch(`/admin/coupons/${c.id}`, { method: 'PATCH', body: { status: c.status ? 0 : 1 } }); load(); } catch (e) { onError(e); } };
  const remove = async () => { try { await adminFetch(`/admin/coupons/${del.id}`, { method: 'DELETE' }); toast('Coupon deleted'); setDel(null); load(); } catch (e) { onError(e); } };

  const label = (c) => (c.type === 'percent' ? `${c.value}% off${c.max_discount ? ` (max ${formatPrice(c.max_discount)})` : ''}` : `${formatPrice(c.value)} off`);
  const expired = (c) => c.expires_at && c.expires_at < new Date().toISOString().slice(0, 10);

  return (
    <div>
      <form className="panel" onSubmit={save} noValidate>
        <div className="panel__head"><h1>{editId ? 'Edit coupon' : 'New coupon'}</h1>{editId && <button type="button" className="btn btn--sm btn--outline" onClick={reset}>Cancel</button>}</div>
        <div className="form-grid">
          <FormField id="cp-code" label="Code *" value={f.code} onChange={set('code')} error={errors.code} placeholder="WELCOME10" maxLength={30} style={{ textTransform: 'uppercase' }} />
          <div className="field"><label htmlFor="cp-type">Type</label><select id="cp-type" value={f.type} onChange={set('type')}><option value="percent">Percentage off</option><option value="fixed">Fixed amount off</option></select></div>
          <FormField id="cp-value" type="number" min="0" step="0.01" label={f.type === 'percent' ? 'Percent off (1–100) *' : 'Amount off (Rs.) *'} value={f.value} onChange={set('value')} error={errors.value} />
          <FormField id="cp-min" type="number" min="0" label="Minimum order (Rs.)" value={f.min_order} onChange={set('min_order')} error={errors.min_order} placeholder="0" />
          {f.type === 'percent' && <FormField id="cp-max" type="number" min="0" label="Max discount (Rs., optional)" value={f.max_discount} onChange={set('max_discount')} error={errors.max_discount} />}
          <FormField id="cp-limit" type="number" min="1" label="Total uses (optional)" value={f.usage_limit} onChange={set('usage_limit')} error={errors.usage_limit} placeholder="Unlimited" />
          <FormField id="cp-exp" type="date" label="Expires on (optional)" value={f.expires_at} onChange={set('expires_at')} error={errors.expires_at} />
          <div className="field"><label htmlFor="cp-status">Status</label><select id="cp-status" value={f.status} onChange={set('status')}><option value="1">Active</option><option value="0">Inactive</option></select></div>
        </div>
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : editId ? 'Update coupon' : 'Create coupon'}</button>
      </form>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel__head"><h2>All coupons</h2></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Code</th><th>Discount</th><th>Min order</th><th>Used</th><th>Expires</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows === null ? <tr><td colSpan={7}>Loading…</td></tr> : !rows.length ? <tr><td colSpan={7}>No coupons yet.</td></tr>
                : rows.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.code}</strong></td><td>{label(c)}</td><td>{c.min_order ? formatPrice(c.min_order) : '—'}</td>
                    <td>{c.used_count}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                    <td>{c.expires_at ? <>{c.expires_at}{expired(c) && <span className="badge badge--off" style={{ marginLeft: 6 }}>Expired</span>}</> : '—'}</td>
                    <td><button className={`badge ${c.status ? 'badge--ok' : 'badge--off'}`} style={{ border: 0, cursor: 'pointer' }} onClick={() => toggle(c)}>{c.status ? 'Active' : 'Inactive'}</button></td>
                    <td><div className="table__actions"><button className="btn btn--sm btn--outline" onClick={() => edit(c)}>Edit</button><button className="btn btn--sm btn--danger" onClick={() => setDel(c)}>Delete</button></div></td>
                  </tr>))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal open={!!del} message={`Delete coupon ${del?.code}? Past orders keep their discount.`} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  );
}
