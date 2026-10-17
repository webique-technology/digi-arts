'use client';
import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminCategories() {
  const { toast, onError } = useAdmin();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { const r = await adminFetch('/admin/categories'); setRows(r.data || []); } catch (e) { onError(e); } finally { setLoading(false); }
  }, [onError]);
  useEffect(() => { load(); }, [load]);

  async function save(e) {
    e.preventDefault();
    if (!name.trim()) return toast('Name is required', 'error');
    setBusy(true);
    try {
      if (editId) await adminFetch(`/admin/categories/${editId}`, { method: 'PUT', body: { name: name.trim() } });
      else await adminFetch('/admin/categories', { method: 'POST', body: { name: name.trim(), status: 1 } });
      toast(editId ? 'Category updated' : 'Category added'); setName(''); setEditId(null); load();
    } catch (err) { onError(err); } finally { setBusy(false); }
  }
  const toggle = async (r) => {
    try { await adminFetch(`/admin/categories/${r.id}`, { method: 'PUT', body: { name: r.name, status: Number(r.status) ? 0 : 1 } }); load(); } catch (e) { onError(e); }
  };
  const confirmDelete = async () => {
    setBusy(true);
    try { await adminFetch(`/admin/categories/${del.id}`, { method: 'DELETE' }); toast('Category deleted'); setDel(null); load(); }
    catch (e) { onError(e); } finally { setBusy(false); }
  };

  return (
    <div className="panel">
      <div className="panel__head"><h1>Categories</h1></div>
      <form onSubmit={save} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="field" style={{ margin: 0, flex: 1, minWidth: 200 }}><input aria-label="Category name" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <button className="btn btn--sm" disabled={busy}>{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" className="btn btn--sm btn--outline" onClick={() => { setEditId(null); setName(''); }}>Cancel</button>}
      </form>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Name</th><th>Slug</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4}>Loading…</td></tr> : !rows.length ? <tr><td colSpan={4}>No categories yet.</td></tr>
              : rows.map((r) => (
                <tr key={r.id}><td>{r.name}</td><td>{r.slug}</td>
                  <td><button className={`badge ${Number(r.status) ? 'badge--ok' : 'badge--off'}`} style={{ border: 0, cursor: 'pointer' }} onClick={() => toggle(r)}>{Number(r.status) ? 'Active' : 'Inactive'}</button></td>
                  <td><div className="table__actions"><button className="btn btn--sm btn--outline" onClick={() => { setEditId(r.id); setName(r.name); }}>Edit</button><button className="btn btn--sm btn--danger" onClick={() => setDel(r)}>Delete</button></div></td></tr>))}
          </tbody>
        </table>
      </div>
      <ConfirmModal open={!!del} message={`Delete category “${del?.name}”? Products in it become uncategorised.`} busy={busy} onConfirm={confirmDelete} onCancel={() => setDel(null)} />
    </div>
  );
}
