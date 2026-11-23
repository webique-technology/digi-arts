'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import { adminFetch, imageUrl } from '@/lib/api';
import { useAdmin } from './AdminProvider';
import { SingleImage } from './ImageDropzone';
import RichTextEditor from './RichTextEditor';

const toDateInput = (d) => {
  if (!d) return '';
  const x = new Date(d);
  return isNaN(x) ? '' : new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export default function BlogForm({ blog }) {
  const router = useRouter();
  const { toast, onError } = useAdmin();
  const [cats, setCats] = useState([]);
  const initialDate = toDateInput(blog?.published_at || new Date());
  const [f, setF] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    category: blog?.category || '',
    tag: blog?.tag || '',
    tags: (blog?.tags || []).join(', '),
    excerpt: blog?.excerpt || '',
    status: String(blog?.status ?? 1),
    published_at: initialDate,
    read_time: blog?.read_time ? String(blog.read_time) : '',
    author_name: blog?.author?.name || '',
    author_role: blog?.author?.role || '',
    meta_title: blog?.meta_title || '',
    meta_description: blog?.meta_description || '',
  });
  const [body, setBody] = useState(blog?.body || '');
  const [cover, setCover] = useState({ file: null, url: blog?.cover_image ? imageUrl(blog.cover_image) : '' });
  const [hero, setHero] = useState({ file: null, url: blog?.hero_image ? imageUrl(blog.hero_image) : '', removed: false });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    adminFetch('/blogs/categories').then((r) => setCats(r.data || [])).catch(onError);
  }, [onError]);

  async function submit(ev) {
    ev.preventDefault();
    const e = {};
    if (!f.title.trim()) e.title = 'Title is required';
    if (!cover.url) e.cover_image = 'Cover image is required';
    if (!body.replace(/<[^>]*>/g, '').trim()) e.body = 'Write the article content';
    if (f.read_time && !(Number(f.read_time) > 0)) e.read_time = 'Enter minutes, or leave blank';
    setErrors(e);
    if (Object.keys(e).length) return;

    const fd = new FormData();
    fd.append('title', f.title.trim());
    if (f.slug.trim()) fd.append('slug', f.slug.trim());
    for (const k of ['category', 'tag', 'excerpt', 'status', 'read_time', 'meta_title', 'meta_description']) fd.append(k, f[k]);
    fd.append('body', body);
    fd.append('tags', JSON.stringify(f.tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)));
    fd.append('author', JSON.stringify({
      ...(blog?.author || {}),
      name: f.author_name.trim(),
      role: f.author_role.trim(),
      initials: f.author_name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    }));
    if (!blog || f.published_at !== initialDate) fd.append('published_at', f.published_at || new Date().toISOString());
    if (cover.file) fd.append('cover_image', cover.file);
    if (hero.file) fd.append('hero_image', hero.file);
    else if (hero.removed) fd.append('hero_image', '');

    setBusy(true);
    try {
      await adminFetch(blog ? `/admin/blogs/${blog.id}` : '/admin/blogs', { method: 'POST', body: fd });
      toast(blog ? 'Blog updated' : 'Blog created');
      router.push('/admin/blogs');
    } catch (err) {
      if (err.status === 422 && err.errors) setErrors(err.errors);
      onError(err);
    } finally {
      setBusy(false);
    }
  }

  const Err = ({ k }) => (errors[k] ? <div className="field__error">{errors[k]}</div> : null);

  return (
    <form className="panel" onSubmit={submit} noValidate>
      <div className="panel__head">
        <div className="panel__title">
          <Link href="/admin/blogs" className="iconbtn" aria-label="Back to blogs" title="Back to blogs">
            <FiArrowLeft aria-hidden="true" />
          </Link>
          <h1>{blog ? 'Edit blog' : 'Add blog'}</h1>
        </div>
        {blog && Number(blog.status) === 1 && (
          <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="btn btn--outline btn--sm">View on site ↗</a>
        )}
      </div>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="bl-title">Title *</label>
          <input id="bl-title" value={f.title} onChange={set('title')} />
          <Err k="title" />
        </div>
        <div className="field">
          <label htmlFor="bl-slug">URL slug</label>
          <input id="bl-slug" value={f.slug} onChange={set('slug')} placeholder="generated from title" />
          <small className="field__hint">/blog/{f.slug || '…'}</small>
        </div>
        <div className="field">
          <label htmlFor="bl-cat">Category</label>
          <select id="bl-cat" value={f.category} onChange={set('category')}>
            <option value="">— None —</option>
            {cats.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="bl-tag">Label</label>
          <input id="bl-tag" value={f.tag} onChange={set('tag')} placeholder="e.g. Festive Gifting & Heritage" />
          <small className="field__hint">Shown as the badge on blog cards</small>
        </div>
        <div className="field">
          <label htmlFor="bl-tags">Tags</label>
          <input id="bl-tags" value={f.tags} onChange={set('tags')} placeholder="Diwali, HandmadePaper" />
          <small className="field__hint">Comma separated</small>
        </div>
        <div className="field">
          <label htmlFor="bl-status">Status</label>
          <select id="bl-status" value={f.status} onChange={set('status')}>
            <option value="1">Published</option>
            <option value="0">Draft</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="bl-date">Publish date</label>
          <input id="bl-date" type="date" value={f.published_at} onChange={set('published_at')} />
          <small className="field__hint">A future date keeps it hidden until then</small>
          <Err k="published_at" />
        </div>
        <div className="field">
          <label htmlFor="bl-author">Author name</label>
          <input id="bl-author" value={f.author_name} onChange={set('author_name')} />
        </div>
        <div className="field">
          <label htmlFor="bl-role">Author role</label>
          <input id="bl-role" value={f.author_role} onChange={set('author_role')} />
        </div>
        <div className="field">
          <label htmlFor="bl-read">Read time (minutes)</label>
          <input id="bl-read" type="number" min="1" value={f.read_time} onChange={set('read_time')} placeholder="Auto" />
          <Err k="read_time" />
        </div>
        <div />
        <div className="field full">
          <label htmlFor="bl-excerpt">Excerpt</label>
          <textarea id="bl-excerpt" rows={2} value={f.excerpt} onChange={set('excerpt')} maxLength={300} />
          <small className="field__hint">Short summary shown on blog cards · {f.excerpt.length}/300</small>
        </div>
        <div className="full" style={{ display: 'grid', gap: '0 16px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <SingleImage label="Cover image * (cards, 4:3)" url={cover.url} aspect="4 / 3" maxMB={3}
            onFile={(file, url) => setCover({ file, url })} onReject={(m) => toast(m, 'error')} error={errors.cover_image} />
          <SingleImage label="Hero image (article banner; uses cover if empty)" url={hero.url} aspect="16 / 6" maxMB={3}
            onFile={(file, url) => setHero({ file, url, removed: false })}
            onClear={() => setHero({ file: null, url: '', removed: true })} onReject={(m) => toast(m, 'error')} />
        </div>
        <div className="field full">
          <label htmlFor="bl-body">Article content *</label>
          <RichTextEditor id="bl-body" value={body} onChange={setBody} />
          <small className="field__hint">Numbered lists show as step cards and bulleted lists as tip cards on the site.</small>
          <Err k="body" />
        </div>
        <div className="field">
          <label htmlFor="bl-mt">SEO title</label>
          <input id="bl-mt" value={f.meta_title} onChange={set('meta_title')} maxLength={200} placeholder="Defaults to the blog title" />
          <small className="field__hint">{f.meta_title.length}/60</small>
        </div>
        <div className="field">
          <label htmlFor="bl-md">SEO description</label>
          <input id="bl-md" value={f.meta_description} onChange={set('meta_description')} maxLength={300} placeholder="Defaults to the excerpt" />
          <small className="field__hint">{f.meta_description.length}/160</small>
        </div>
      </div>
      <button className="btn" disabled={busy}>{busy ? 'Saving…' : blog ? 'Update blog' : 'Create blog'}</button>
    </form>
  );
}
