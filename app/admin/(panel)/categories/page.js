'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiEdit2, FiImage, FiTrash2, FiX } from 'react-icons/fi';
import { adminFetch, imageUrl } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import ConfirmModal from '@/components/admin/ConfirmModal';

const EMPTY_IMAGE = { file: null, url: '', removed: false };
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 2;

export default function AdminCategories() {
  const { toast, onError } = useAdmin();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [image, setImage] = useState(EMPTY_IMAGE);
  const [drag, setDrag] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef(null);
  const nameInput = useRef(null);

  const load = useCallback(async () => {
    try { const r = await adminFetch('/admin/categories'); setRows(r.data || []); } catch (e) { onError(e); } finally { setLoading(false); }
  }, [onError]);
  useEffect(() => { load(); }, [load]);

  const reset = () => { setEditRow(null); setName(''); setImage(EMPTY_IMAGE); };
  const startEdit = (r) => {
    setEditRow(r);
    setName(r.name);
    setImage({ ...EMPTY_IMAGE, url: r.image ? imageUrl(r.image) : '' });
    nameInput.current?.focus();
  };

  const pickFile = (file) => {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) return toast('Only JPG, PNG or WebP images', 'error');
    if (file.size > MAX_MB * 1024 * 1024) return toast(`Image must be under ${MAX_MB} MB`, 'error');
    setImage({ file, url: URL.createObjectURL(file), removed: false });
  };

  async function save(e) {
    e.preventDefault();
    if (!name.trim()) return toast('Name is required', 'error');
    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('status', String(editRow ? editRow.status : 1));
    if (image.file) fd.append('image', image.file);
    if (image.removed && !image.file) fd.append('remove_image', '1');

    setBusy(true);
    try {
      if (editRow) await adminFetch(`/admin/categories/${editRow.id}`, { method: 'PUT', body: fd });
      else await adminFetch('/admin/categories', { method: 'POST', body: fd });
      toast(editRow ? 'Category updated' : 'Category added'); reset(); load();
    } catch (err) { onError(err); } finally { setBusy(false); }
  }
  const toggle = async (r) => {
    try { await adminFetch(`/admin/categories/${r.id}`, { method: 'PUT', body: { name: r.name, status: Number(r.status) ? 0 : 1 } }); load(); } catch (e) { onError(e); }
  };
  const confirmDelete = async () => {
    setBusy(true);
    try { await adminFetch(`/admin/categories/${del.id}`, { method: 'DELETE' }); toast('Category deleted'); setDel(null); if (editRow?.id === del.id) reset(); load(); }
    catch (e) { onError(e); } finally { setBusy(false); }
  };

  return (
    <div className="panel">
      <div className="panel__head">
        <h1>Categories</h1>
        {!loading && <span className="catcount">{rows.length} total</span>}
      </div>

      <form className="catform" onSubmit={save}>
        <div className="catform__image">
          <button
            type="button"
            className={`catform__tile ${image.url ? 'has-image' : ''} ${drag ? 'is-drag' : ''}`}
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
            aria-label={image.url ? 'Change category image' : 'Add category image'}
          >
            {image.url ? <img src={image.url} alt="" /> : <><FiImage aria-hidden="true" /><span>Add image</span></>}
          </button>
          {image.url && (
            <button type="button" className="catform__remove" onClick={() => setImage({ file: null, url: '', removed: true })} aria-label="Remove image" title="Remove image">
              <FiX aria-hidden="true" />
            </button>
          )}
          <input ref={fileInput} type="file" accept={IMAGE_TYPES.join(',')} hidden onChange={(e) => { pickFile(e.target.files[0]); e.target.value = ''; }} />
        </div>

        <div className="catform__main">
          <label className="catform__title" htmlFor="cat-name">{editRow ? `Edit “${editRow.name}”` : 'New category'}</label>
          <div className="catform__row">
            <input ref={nameInput} id="cat-name" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn" disabled={busy}>{busy ? 'Saving…' : editRow ? 'Save changes' : 'Add category'}</button>
            {editRow && <button type="button" className="btn btn--outline" onClick={reset}>Cancel</button>}
          </div>
          <p className="catform__hint">Square image, JPG, PNG or WebP up to {MAX_MB} MB. Shown on the shop&apos;s category tiles.</p>
        </div>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th>Products</th><th>Status</th><th aria-label="Actions" /></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6}>Loading…</td></tr> : !rows.length ? <tr><td colSpan={6}>No categories yet.</td></tr>
              : rows.map((r) => (
                <tr key={r.id} className={editRow?.id === r.id ? 'is-editing' : ''}>
                  <td>{r.image ? <img className="catthumb" src={imageUrl(r.image)} alt="" /> : <span className="catthumb catthumb--empty"><FiImage aria-hidden="true" /></span>}</td>
                  <td><button type="button" className="table__link" onClick={() => startEdit(r)}>{r.name}</button></td><td>{r.slug}</td><td>{r.product_count}</td>
                  <td><button className={`badge ${Number(r.status) ? 'badge--ok' : 'badge--off'}`} style={{ border: 0, cursor: 'pointer' }} onClick={() => toggle(r)}>{Number(r.status) ? 'Active' : 'Inactive'}</button></td>
                  <td>
                    <div className="table__actions">
                      <button className="iconbtn" onClick={() => startEdit(r)} aria-label={`Edit ${r.name}`} title="Edit"><FiEdit2 aria-hidden="true" /></button>
                      <button className="iconbtn iconbtn--danger" onClick={() => setDel(r)} aria-label={`Delete ${r.name}`} title="Delete"><FiTrash2 aria-hidden="true" /></button>
                    </div>
                  </td>
                </tr>))}
          </tbody>
        </table>
      </div>
      <ConfirmModal open={!!del} message={`Delete category “${del?.name}”? Categories that still have products can't be deleted.`} busy={busy} onConfirm={confirmDelete} onCancel={() => setDel(null)} />
    </div>
  );
}
