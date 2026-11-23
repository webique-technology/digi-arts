'use client';
import { useCallback, useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { adminFetch } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import ConfirmModal from '@/components/admin/ConfirmModal';

const TABS = [['all', 'All'], ['unread', 'Unread'], ['read', 'Read']];

const fmtDate = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');

// Bare 10-digit numbers are assumed to be Indian mobiles.
const intlDigits = (phone) => {
  const d = String(phone || '').replace(/\D/g, '').replace(/^0+/, '');
  return d.length === 10 ? `91${d}` : d;
};

export default function AdminMessages() {
  const { toast, onError } = useAdmin();
  const [rows, setRows] = useState(null);
  const [tab, setTab] = useState('all');
  const [del, setDel] = useState(null);
  const load = useCallback(() => adminFetch('/admin/messages').then((r) => setRows(r.data || [])).catch(onError), [onError]);
  useEffect(() => { load(); }, [load]);

  const toggle = async (m) => { try { await adminFetch(`/admin/messages/${m.id}`, { method: 'PATCH', body: { is_read: m.is_read ? 0 : 1 } }); load(); } catch (e) { onError(e); } };
  const remove = async () => { try { await adminFetch(`/admin/messages/${del.id}`, { method: 'DELETE' }); toast('Message deleted'); setDel(null); load(); } catch (e) { onError(e); } };

  const unread = rows ? rows.filter((m) => !m.is_read).length : 0;
  const shown = (rows || []).filter((m) => (tab === 'unread' ? !m.is_read : tab === 'read' ? m.is_read : true));

  return (
    <div className="panel">
      <div className="panel__head"><h1>Messages{unread ? ` (${unread} unread)` : ''}</h1></div>
      <div className="tabs" role="tablist">{TABS.map(([v, l]) => <button key={v} role="tab" aria-selected={tab === v} className={tab === v ? 'is-active' : ''} onClick={() => setTab(v)}>{l}</button>)}</div>
      {rows === null ? <p>Loading…</p> : !shown.length ? <p>{rows.length ? 'Nothing here.' : 'No messages yet.'}</p> : (
        <ul className="msglist">
          {shown.map((m) => {
            const tel = intlDigits(m.phone);
            return (
              <li key={m.id} className={m.is_read ? '' : 'is-unread'}>
                <div className="msglist__top"><strong>{m.name}</strong><small>{fmtDate(m.created_at)}</small></div>
                <p>{m.message}</p>
                <div className="msglist__meta">
                  {m.phone && <a href={`tel:+${tel}`}>{m.phone}</a>}
                  {m.phone && <a href={`https://wa.me/${tel}`} target="_blank" rel="noreferrer">WhatsApp</a>}
                  {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className="btn btn--sm btn--outline" onClick={() => toggle(m)}>{m.is_read ? 'Mark unread' : 'Mark read'}</button>
                    <button className="iconbtn iconbtn--danger" onClick={() => setDel(m)} aria-label={`Delete message from ${m.name}`} title="Delete"><FiTrash2 aria-hidden="true" /></button>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>)}
      <ConfirmModal open={!!del} message={`Delete the message from ${del?.name}?`} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  );
}
