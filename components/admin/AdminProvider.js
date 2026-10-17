'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch, setCsrf } from '@/lib/api';

const Ctx = createContext(null);
export const useAdmin = () => useContext(Ctx);

export default function AdminProvider({ children }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    adminFetch('/admin/me')
      .then((r) => { setAdmin(r.data.admin); setCsrf(r.data.csrf_token); })
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  // Central error handler: session expired -> login, otherwise toast
  const onError = useCallback((err) => {
    if (err?.status === 401) { setCsrf(''); router.replace('/admin/login'); return; }
    toast(err?.message || 'Something went wrong', 'error');
  }, [router, toast]);

  const logout = useCallback(async () => {
    try {
      await adminFetch('/admin/logout', { method: 'POST' });
      setCsrf('');
      router.replace('/admin/login');
    } catch (err) {
      onError(err);
    }
  }, [onError, router]);

  if (!admin) return <div className="auth"><p>Loading…</p></div>;
  return (
    <Ctx.Provider value={{ admin, toast, onError, logout }}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast toast--${t.type}`}>{t.message}</div>)}
      </div>
    </Ctx.Provider>
  );
}
