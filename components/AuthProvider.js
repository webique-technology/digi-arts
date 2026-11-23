"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "./accoount/AuthModal";
import { apiFetch } from "@/lib/api";


const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    apiFetch("/auth/session")
      .then((r) => setUser(r.data.user))
      .catch(() => setUser(null));
  }, []);

  const openLogin = () => setShowLoginModal(true);
  const closeLogin = () => setShowLoginModal(false);

  const login = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    router.push("/account");
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn: Boolean(user),
        openLogin,
        closeLogin,
        login,
        logout,
      }}
    >
      {children}

      {/* Global Login Popup */}
      <AuthModal
        show={showLoginModal}
        onHide={closeLogin}
        onLoginSuccess={login}
      />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
