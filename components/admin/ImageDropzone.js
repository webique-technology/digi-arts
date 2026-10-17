'use client';
import { useRef, useState } from 'react';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ok = (file, maxMB, onReject) => {
  if (!TYPES.includes(file.type)) { onReject?.(`${file.name}: only JPG, PNG or WebP allowed`); return false; }
  if (file.size > maxMB * 1024 * 1024) { onReject?.(`${file.name}: larger than ${maxMB} MB`); return false; }
  return true;
};

/** Multi-image: drag & drop, preview, choose primary, reorder, remove. */
export default function ImageDropzone({ items, onChange, primary, onPrimary, maxMB = 2, max = 10, onReject }) {
  const input = useRef(null);
  const [drag, setDrag] = useState(false);

  const add = (files) => {
    const next = [...items];
    Array.from(files).forEach((file) => {
      if (!ok(file, maxMB, onReject)) return;
      if (next.length >= max) { onReject?.(`Maximum ${max} images`); return; }
      next.push({ key: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, file, url: URL.createObjectURL(file) });
    });
    onChange(next);
    if (!primary && next[0]) onPrimary(next[0].key);
  };
  const move = (i, d) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const n = [...items]; [n[i], n[j]] = [n[j], n[i]]; onChange(n);
  };
  const remove = (i) => {
    const it = items[i]; if (it.file) URL.revokeObjectURL(it.url);
    const n = items.filter((_, x) => x !== i); onChange(n);
    if (it.key === primary) onPrimary(n[0]?.key || '');
  };

  return (
    <div>
      <div
        className={`dropzone ${drag ? 'is-drag' : ''}`} role="button" tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
      >
        Drag &amp; drop images here, or click to browse<br /><small>JPG, PNG, WebP · max {maxMB} MB each · up to {max}</small>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
          onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
      </div>
      {items.length > 0 && (
        <div className="thumbs">
          {items.map((it, i) => (
            <div key={it.key} className={`thumb ${it.key === primary ? 'is-primary' : ''}`}>
              <img src={it.url} alt={`Preview ${i + 1}`} />
              <div className="thumb__bar">
                <label><input type="radio" name="primary" checked={it.key === primary} onChange={() => onPrimary(it.key)} /> Primary</label>
                <span>
                  <button type="button" onClick={() => move(i, -1)} aria-label="Move left">←</button>
                  <button type="button" onClick={() => move(i, 1)} aria-label="Move right">→</button>
                  <button type="button" onClick={() => remove(i)} aria-label="Remove image">✕</button>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Single image picker with preview (used for banners). */
export function SingleImage({ label, url, onFile, onClear, maxMB = 3, aspect = '16 / 6', onReject, error }) {
  const input = useRef(null);
  const pick = (file) => { if (file && ok(file, maxMB, onReject)) onFile(file, URL.createObjectURL(file)); };
  return (
    <div className="field">
      <label>{label}</label>
      <div className="dropzone" style={{ padding: url ? 8 : undefined }} role="button" tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]); }}>
        {url ? <img src={url} alt={`${label} preview`} style={{ width: '100%', aspectRatio: aspect, objectFit: 'cover', borderRadius: 6 }} /> : <>Click or drop an image<br /><small>JPG, PNG, WebP · max {maxMB} MB</small></>}
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { pick(e.target.files[0]); e.target.value = ''; }} />
      </div>
      {url && onClear && <button type="button" className="btn btn--sm btn--outline" style={{ marginTop: 6 }} onClick={onClear}>Remove</button>}
      {error && <div className="field__error">{error}</div>}
    </div>
  );
}
