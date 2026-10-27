"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminFetch, imageUrl } from "@/lib/api";
import { useAdmin } from "@/components/admin/AdminProvider";
import ConfirmModal from "@/components/admin/ConfirmModal";

export default function AdminBanners() {
  const { toast, onError } = useAdmin();
  const [st, setSt] = useState({ loading: true, rows: [] });
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await adminFetch("/admin/banners");
      setSt({ loading: false, rows: r.data || [] });
    } catch (e) {
      onError(e);
      setSt((s) => ({ ...s, loading: false }));
    }
  }, [onError]);
  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (row) => {
    try {
      await adminFetch(`/admin/banners/${row.id}`, {
        method: "PATCH",
        body: { status: Number(row.status) ? 0 : 1 },
      });
      load();
    } catch (e) {
      onError(e);
    }
  };
  const confirmDelete = async () => {
    setBusy(true);
    try {
      await adminFetch(`/admin/banners/${del.id}`, { method: "DELETE" });
      toast("Banner deleted");
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
        <h1>Banners</h1>
        <Link href="/admin/banners/new" className="btn btn--sm">
          + Add banner
        </Link>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Order</th>
              <th>Schedule</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {st.loading ? (
              <tr>
                <td colSpan={6}>Loading…</td>
              </tr>
            ) : !st.rows.length ? (
              <tr>
                <td colSpan={6}>No banners yet.</td>
              </tr>
            ) : (
              st.rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <img
                      src={imageUrl(r.image_desktop)}
                      alt=""
                      style={{
                        width: 120,
                        aspectRatio: "16/6",
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  </td>
                  <td>{r.title}</td>
                  <td>{r.sort_order}</td>
                  <td>
                    {r.start_date || "—"} → {r.end_date || "—"}
                  </td>
                  <td>
                    <button
                      className={`badge ${Number(r.status) ? "badge--ok" : "badge--off"}`}
                      style={{ border: 0, cursor: "pointer" }}
                      onClick={() => toggle(r)}
                    >
                      {Number(r.status) ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <div className="table__actions">
                      <Link
                        className="btn btn--sm btn--outline"
                        href={`/admin/banners/${r.id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => setDel(r)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        open={!!del}
        message={`Delete banner “${del?.title}”?`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDel(null)}
      />
    </div>
  );
}
