'use client';
import { useCallback, useEffect, useState } from 'react';
import { adminFetch, imageUrl } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAdmin } from '@/components/admin/AdminProvider';

const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const TABS = [['', 'All'], ...STATUSES.map((s) => [s, s[0].toUpperCase() + s.slice(1)])];
const fmtDate = (d) => new Date(d.replace(' ', 'T')).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function AdminOrders() {
  const { toast, onError } = useAdmin();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [st, setSt] = useState({ loading: true, rows: [], meta: {} });
  const [detail, setDetail] = useState(null);

  const load = useCallback(async () => {
    setSt((s) => ({ ...s, loading: true }));
    try {
      const r = await adminFetch(`/admin/orders?page=${page}&limit=12&status=${status}&q=${encodeURIComponent(query)}`);
      setSt({ loading: false, rows: r.data || [], meta: r.meta || {} });
    } catch (e) { onError(e); setSt((s) => ({ ...s, loading: false })); }
  }, [page, status, query, onError]);
  useEffect(() => { load(); }, [load]);

  const open = async (id) => { try { setDetail((await adminFetch(`/admin/orders/${id}`)).data); } catch (e) { onError(e); } };
  const change = async (id, next) => {
    try {
      await adminFetch(`/admin/orders/${id}`, { method: 'PATCH', body: { status: next } });
      toast(`Order marked ${next}`); load();
      if (detail?.id === id) setDetail({ ...detail, status: next });
    } catch (e) { onError(e); }
  };

  return (
    <div className="panel">
      <div className="panel__head"><h1>Orders</h1>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); setQuery(q.trim()); }} className="searchbar">
          <input placeholder="Search order #, name or phone" aria-label="Search orders" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn btn--sm">Search</button>
        </form>
      </div>
      <div className="tabs" role="tablist">{TABS.map(([v, l]) => <button key={v} role="tab" aria-selected={status === v} className={status === v ? 'is-active' : ''} onClick={() => { setStatus(v); setPage(1); }}>{l}</button>)}</div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th /></tr></thead>
          <tbody>
            {st.loading ? <tr><td colSpan={7}>Loading…</td></tr> : !st.rows.length ? <tr><td colSpan={7}>No orders found.</td></tr>
              : st.rows.map((o) => (
                <tr key={o.id}>
                  <td><strong>{o.order_number}</strong></td><td>{fmtDate(o.created_at)}</td>
                  <td>{o.customer_name}<br /><small><a href={`tel:+91${o.phone}`}>+91 {o.phone}</a></small></td>
                  <td>{o.items_count}</td><td>{formatPrice(o.total)}</td>
                  <td><select className={`status status--${o.status}`} value={o.status} onChange={(e) => change(o.id, e.target.value)} disabled={o.status === 'cancelled'} aria-label="Order status">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></td>
                  <td><button className="btn btn--sm btn--outline" onClick={() => open(o.id)}>View</button></td>
                </tr>))}
          </tbody>
        </table>
      </div>
      {Number(st.meta.pages) > 1 && (
        <div className="pagination">
          <button className="btn btn--sm btn--outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ Prev</button>
          <span>Page {page} / {st.meta.pages}</span>
          <button className="btn btn--sm btn--outline" disabled={page >= st.meta.pages} onClick={() => setPage(page + 1)}>Next ›</button>
        </div>)}

      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <div className="modal modal--wide" role="dialog" aria-modal="true" aria-label={`Order ${detail.order_number}`} onClick={(e) => e.stopPropagation()}>
            <div className="panel__head"><h3>Order {detail.order_number}</h3><button className="btn btn--sm btn--outline" onClick={() => setDetail(null)}>Close</button></div>
            <div className="detail">
              <div><h4>Customer</h4><p>{detail.customer_name}<br /><a href={`tel:+91${detail.phone}`}>+91 {detail.phone}</a> · <a href={`https://wa.me/91${detail.phone}`} target="_blank" rel="noreferrer">WhatsApp</a>{detail.email && <><br />{detail.email}</>}</p></div>
              <div><h4>Ship to</h4><p>{detail.address}<br />{detail.city}, {detail.state} {detail.pincode}</p></div>
            </div>
            {detail.notes && <p className="detail__note"><strong>Note:</strong> {detail.notes}</p>}
            <ul className="detail__items">
              {detail.items.map((i, n) => (
                <li key={n}>{i.image ? <img src={imageUrl(i.image)} alt="" /> : <span className="visual-ph" />}<span>{i.title}</span><span>{i.qty} × {formatPrice(i.price)}</span><strong>{formatPrice(i.qty * i.price)}</strong></li>
              ))}
            </ul>
            <div className="detail__totals"><span>Subtotal {formatPrice(detail.subtotal)}</span>{detail.discount > 0 && <span>Discount ({detail.coupon_code}) −{formatPrice(detail.discount)}</span>}<span>Shipping {detail.shipping ? formatPrice(detail.shipping) : 'Free'}</span><strong>Total {formatPrice(detail.total)} (Cash on delivery)</strong></div>
            <div className="field" style={{ marginTop: 14 }}><label htmlFor="ds">Status</label>
              <select id="ds" value={detail.status} disabled={detail.status === 'cancelled'} onChange={(e) => change(detail.id, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              {detail.status === 'cancelled' && <small>Cancelled orders can’t be reopened. Stock was returned.</small>}</div>
          </div>
        </div>
      )}
    </div>
  );
}
