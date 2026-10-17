'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminFetch, imageUrl } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAdmin } from '@/components/admin/AdminProvider';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminProducts() {
  const { toast, onError } = useAdmin();
  const [page, setPage] = useState(1);
  const [st, setSt] = useState({ loading: true, rows: [], meta: {} });
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setSt((s) => ({ ...s, loading: true }));
    try { const r = await adminFetch(`/admin/products?page=${page}&limit=10`); setSt({ loading: false, rows: r.data || [], meta: r.meta || {} }); }
    catch (e) { onError(e); setSt((s) => ({ ...s, loading: false })); }
  }, [page, onError]);
  useEffect(() => { load(); }, [load]);

  const toggle = async (row) => {
    try { await adminFetch(`/admin/products/${row.id}`, { method: 'PATCH', body: { status: Number(row.status) ? 0 : 1 } }); load(); }
    catch (e) { onError(e); }
  };
  const confirmDelete = async () => {
    setBusy(true);
    try { await adminFetch(`/admin/products/${del.id}`, { method: 'DELETE' }); toast('Product deleted'); setDel(null); load(); }
    catch (e) { onError(e); } finally { setBusy(false); }
  };

  return (
    <div className="panel">
      <div className="panel__head"><h1>Products</h1><Link href="/admin/products/new" className="btn btn--sm">+ Add product</Link></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {st.loading ? <tr><td colSpan={7}>Loading…</td></tr>
              : !st.rows.length ? <tr><td colSpan={7}>No products yet.</td></tr>
              : st.rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.primary_image ? <img className="table__thumb" src={imageUrl(r.primary_image)} alt="" /> : <div className="table__thumb" />}</td>
                  <td>{r.title}</td><td>{r.category_name || '—'}</td>
                  <td>{r.sale_price ? <>{formatPrice(r.sale_price)} <s>{formatPrice(r.price)}</s></> : formatPrice(r.price)}</td>
                  <td>{r.stock}</td>
                  <td><button className={`badge ${Number(r.status) ? 'badge--ok' : 'badge--off'}`} style={{ border: 0, cursor: 'pointer' }} onClick={() => toggle(r)}>{Number(r.status) ? 'Active' : 'Inactive'}</button></td>
                  <td><div className="table__actions"><Link className="btn btn--sm btn--outline" href={`/admin/products/${r.id}`}>Edit</Link><button className="btn btn--sm btn--danger" onClick={() => setDel(r)}>Delete</button></div></td>
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
      <ConfirmModal open={!!del} message={`Delete “${del?.title}”? Its images will be removed too.`} busy={busy} onConfirm={confirmDelete} onCancel={() => setDel(null)} />
    </div>
  );
}
