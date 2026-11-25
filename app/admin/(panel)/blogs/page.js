"use client";
import Link from "next/link";
import { FiEdit2, FiExternalLink, FiTrash2 } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";
import { smallImage } from "@/lib/images";
import { useAdmin } from "@/components/admin/AdminProvider";
import ConfirmModal from "@/components/admin/ConfirmModal";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const statusOf = (r) => {
  if (!Number(r.status)) return { label: "Draft", cls: "badge--off" };
  if (new Date(r.published_at) > new Date()) return { label: "Scheduled", cls: "badge--warn" };
  return { label: "Published", cls: "badge--ok" };
};

export default function AdminBlogs() {
  const { toast, onError } = useAdmin();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [st, setSt] = useState({ loading: true, rows: [], meta: {} });
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setSt((s) => ({ ...s, loading: true }));
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (query) params.set("q", query);
      const r = await adminFetch(`/admin/blogs?${params}`);
      setSt({ loading: false, rows: r.data || [], meta: r.meta || {} });
    } catch (e) {
      onError(e);
      setSt((s) => ({ ...s, loading: false }));
    }
  }, [page, query, onError]);
  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (row) => {
    try {
      await adminFetch(`/admin/blogs/${row.id}`, { method: "PATCH", body: { status: Number(row.status) ? 0 : 1 } });
      load();
    } catch (e) {
      onError(e);
    }
  };
  const confirmDelete = async () => {
    setBusy(true);
    try {
      await adminFetch(`/admin/blogs/${del.id}`, { method: "DELETE" });
      toast("Blog deleted");
      setDel(null);
      load();
    } catch (e) {
      onError(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel__head">
        <h1>Blogs</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <form
            className="searchbar"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setQuery(q.trim());
            }}
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title" aria-label="Search blogs" />
            <button className="btn btn--sm btn--outline">Search</button>
          </form>
          <Link href="/admin/blogs/new" className="btn btn--sm">
            + Add blog
          </Link>
        </div>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Published</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {st.loading ? (
              <tr>
                <td colSpan={7}>Loading…</td>
              </tr>
            ) : !st.rows.length ? (
              <tr>
                <td colSpan={7}>{query ? "No blogs match your search." : "No blogs yet."}</td>
              </tr>
            ) : (
              st.rows.map((r) => {
                const s = statusOf(r);
                return (
                  <tr key={r.id}>
                    <td>
                      {r.cover_image ? <img className="table__thumb" src={smallImage(r.cover_image, r.cover_image_variants)} alt="" /> : <div className="table__thumb" />}
                    </td>
                    <td>
                      <Link className="table__link" href={`/admin/blogs/${r.id}`}>
                        {r.title}
                      </Link>
                      {r.tag && <div className="field__hint" style={{ marginTop: 2 }}>{r.tag}</div>}
                    </td>
                    <td>{r.category || "—"}</td>
                    <td>{r.author?.name || "—"}</td>
                    <td>{fmtDate(r.published_at)}</td>
                    <td>
                      <button
                        className={`badge ${s.cls}`}
                        style={{ border: 0, cursor: "pointer" }}
                        onClick={() => toggle(r)}
                        title={Number(r.status) ? "Click to move to drafts" : "Click to publish"}
                      >
                        {s.label}
                      </button>
                    </td>
                    <td>
                      <div className="table__actions">
                        <Link className="iconbtn" href={`/admin/blogs/${r.id}`} aria-label={`Edit ${r.title}`} title="Edit">
                          <FiEdit2 aria-hidden="true" />
                        </Link>
                        {s.label === "Published" && (
                          <a className="iconbtn" href={`/blog/${r.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${r.title}`} title="View on site">
                            <FiExternalLink aria-hidden="true" />
                          </a>
                        )}
                        <button className="iconbtn iconbtn--danger" onClick={() => setDel(r)} aria-label={`Delete ${r.title}`} title="Delete">
                          <FiTrash2 aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {Number(st.meta.pages) > 1 && (
        <div className="pagination">
          <button className="btn btn--sm btn--outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ‹ Prev
          </button>
          <span>
            Page {page} / {st.meta.pages}
          </span>
          <button className="btn btn--sm btn--outline" disabled={page >= st.meta.pages} onClick={() => setPage(page + 1)}>
            Next ›
          </button>
        </div>
      )}
      <ConfirmModal
        open={!!del}
        message={`Delete “${del?.title}”? Its images will be removed too.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDel(null)}
      />
    </div>
  );
}
