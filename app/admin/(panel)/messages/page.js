'use client';
import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminMessages() {
  const { toast, onError } = useAdmin();
  const [rows, setRows] = useState(null);
  const [del, setDel] = useState(null);
  const load = useCallback(() => adminFetch('/admin/messages').then((r) => setRows(r.data || [])).catch(onError), [onError]);
  useEffect(() => { load(); }, [load]);

  const toggle = async (m) => { try { await adminFetch(`/admin/messages/${m.id}`, { method: 'PATCH', body: { is_read: m.is_read ? 0 : 1 } }); load(); } catch (e) { onError(e); } };
  const remove = async () => { try { await adminFetch(`/admin/messages/${del.id}`, { method: 'DELETE' }); toast('Message deleted'); setDel(null); load(); } catch (e) { onError(e); } };

  return (
    <div className="panel">
      <div className="panel__head"><h1>Messages</h1></div>
      {rows === null ? <p>Loading…</p> : !rows.length ? <p>No messages yet.</p> : (
        <ul className="msglist">
          {rows.map((m) => (
            <li key={m.id} className={m.is_read ? '' : 'is-unread'}>
              <div className="msglist__top"><strong>{m.name}</strong><small>{m.created_at}</small></div>
              <p>{m.message}</p>
              <div className="msglist__meta">
                {m.phone && <a href={`tel:+91${m.phone}`}>+91 {m.phone}</a>}{m.phone && <a href={`https://wa.me/91${m.phone}`} target="_blank" rel="noreferrer">WhatsApp</a>}
                {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button className="btn btn--sm btn--outline" onClick={() => toggle(m)}>{m.is_read ? 'Mark unread' : 'Mark read'}</button>
                  <button className="btn btn--sm btn--danger" onClick={() => setDel(m)}>Delete</button>
                </span>
              </div>
            </li>))}
        </ul>)}
      <ConfirmModal open={!!del} message={`Delete the message from ${del?.name}?`} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  );
}
