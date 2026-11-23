'use client';
import { useCallback, useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { adminFetch } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import ConfirmModal from '@/components/admin/ConfirmModal';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

// A leading = + - @ tab or CR would make spreadsheets evaluate the cell as a formula
const csvCell = (v) => `"${String(v).replace(/^(?=[=+\-@\t\r])/, "'").replace(/"/g, '""')}"`;

export default function AdminSubscribers() {
  const { toast, onError } = useAdmin();
  const [rows, setRows] = useState(null);
  const [del, setDel] = useState(null);
  const load = useCallback(() => adminFetch('/admin/subscribers').then((r) => setRows(r.data || [])).catch(onError), [onError]);
  useEffect(() => { load(); }, [load]);

  const remove = async () => { try { await adminFetch(`/admin/subscribers/${del.id}`, { method: 'DELETE' }); toast('Subscriber removed'); setDel(null); load(); } catch (e) { onError(e); } };

  const copyAll = async () => {
    try { await navigator.clipboard.writeText(rows.map((s) => s.email).join(', ')); toast('Emails copied'); } catch (e) { onError(e); }
  };

  const exportCsv = () => {
    const csv = ['email,subscribed_on', ...rows.map((s) => `${csvCell(s.email)},${new Date(s.createdAt).toISOString().slice(0, 10)}`)].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'subscribers.csv' });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel">
      <div className="panel__head">
        <h1>Subscribers{rows?.length ? ` (${rows.length})` : ''}</h1>
        {!!rows?.length && (
          <span style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn--sm btn--outline" onClick={copyAll}>Copy emails</button>
            <button className="btn btn--sm" onClick={exportCsv}>Export CSV</button>
          </span>
        )}
      </div>
      {rows === null ? <p>Loading…</p> : !rows.length ? <p>No subscribers yet.</p> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Email</th><th>Subscribed</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td><a className="table__link" href={`mailto:${s.email}`}>{s.email}</a></td>
                  <td>{fmtDate(s.createdAt)}</td>
                  <td className="table__actions"><button className="iconbtn iconbtn--danger" onClick={() => setDel(s)} aria-label={`Remove ${s.email}`} title="Remove"><FiTrash2 aria-hidden="true" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal open={!!del} message={`Remove ${del?.email} from subscribers?`} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  );
}
