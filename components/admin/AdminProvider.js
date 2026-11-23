"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { adminFetch, setCsrf } from "@/lib/api";

const Ctx = createContext(null);
export const useAdmin = () => useContext(Ctx);

const clearSession = () => setCsrf("");

export default function AdminProvider({ children }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/admin/me")
      .then((r) => {
        setAdmin(r.data.admin);
        setCsrf(r.data.csrf_token);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.status === 401) clearSession();
        router.replace("/admin/login");
      });
  }, [router]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const onError = useCallback(
    (err) => {
      if (err?.status === 401) {
        clearSession();
        router.replace("/admin/login");
        return;
      }
      toast(err?.message || "Something went wrong", "error");
    },
    [router, toast],
  );

  const logout = useCallback(async () => {
    try {
      await adminFetch("/admin/logout", { method: "POST" });
    } catch {
      toast("Could not log out. You are still signed in. Please try again.", "error");
      return;
    }
    clearSession();
    router.replace("/admin/login");
  }, [router, toast]);

  if (loading || !admin) {
    return (
      <div
        className="auth"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <Ctx.Provider value={{ admin, toast, onError, logout }}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
