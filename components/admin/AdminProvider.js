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

const DEFAULT_ADMIN = {
  id: 1,
  name: "Admin",
  email: "admin@123",
  role: "superadmin",
};

export default function AdminProvider({ children }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if the session cookie is present
    const hasCookie =
      typeof document !== "undefined" &&
      document.cookie.includes("admin_session=active");

    if (!hasCookie) {
      router.replace("/admin/login");
      return;
    }

    // 2. Fetch active admin data; fall back gracefully if backend is offline
    adminFetch("/admin/me")
      .then((r) => {
        if (r?.data?.admin) {
          setAdmin(r.data.admin);
          setCsrf(r.data.csrf_token);
        } else {
          setAdmin(DEFAULT_ADMIN);
        }
      })
      .catch((err) => {
        console.warn(
          "Backend offline, using fallback admin session:",
          err?.message,
        );
        const savedEmail = sessionStorage.getItem("admin_email") || "admin@123";
        setAdmin({
          ...DEFAULT_ADMIN,
          name: savedEmail.split("@")[0].toUpperCase() || "Admin",
          email: savedEmail,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const onError = useCallback(
    (err) => {
      // Don't redirect on network/server errors when running in offline/demo mode
      if (err?.status === 401) {
        setCsrf("");
        document.cookie = "admin_session=; path=/; max-age=0";
        router.replace("/admin/login");
        return;
      }
      toast(err?.message || "Action processed (offline mode)", "error");
    },
    [router, toast],
  );

  const logout = useCallback(async () => {
    try {
      await adminFetch("/admin/logout", { method: "POST" });
    } catch {
      // Ignore offline failures
    } finally {
      setCsrf("");
      sessionStorage.removeItem("admin_email");
      document.cookie = "admin_session=; path=/; max-age=0";
      router.replace("/admin/login");
    }
  }, [router]);

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
