"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "./accoount/AuthModal";


const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check login session on mount
  useEffect(() => {
    const session =
      typeof window !== "undefined" && localStorage.getItem("user_session");
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const openLogin = () => setShowLoginModal(true);
  const closeLogin = () => setShowLoginModal(false);

  // Called when OTP (123456) is successfully verified
  const login = (userData) => {
    localStorage.setItem("user_session", JSON.stringify(userData));
    setUser(userData);
    setShowLoginModal(false);
    // Redirect to dashboard only AFTER OTP success
    router.push("/account");
  };

  const logout = () => {
    localStorage.removeItem("user_session");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
