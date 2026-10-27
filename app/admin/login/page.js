"use client";

import { useState } from "react";
import { setCsrf } from "@/lib/api";
import Logo from "@/components/Logo";
import { TEST_IDS } from "@/components/testIds";

const DEFAULT_EMAIL = "admin@123";
const DEFAULT_PASSWORD = "123456";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@123");
  const [password, setPassword] = useState("123456");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    const errs = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) errs.email = "Enter your email address";
    if (!password) errs.password = "Enter your password";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);

    try {
      if (trimmedEmail === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
        const sessionToken = "demo_admin_jwt_session_token_123456";

        if (typeof setCsrf === "function") {
          setCsrf(sessionToken);
        }

        // Set the standardized, RFC 6265-compliant cookie checked by middleware
        const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
        document.cookie = `admin_session=active; path=/; expires=${expires}; SameSite=Lax`;

        // Store identity for UI rehydration
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_email", trimmedEmail);
        }

        // Hard navigation so Edge Middleware reads the new cookie immediately
        window.location.href = "/admin";
      } else {
        setError("Invalid email or password. Please use admin@123 / 123456");
        setBusy(false);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <aside className="login__brand">
        <Logo className="login__logo" />
        <h2>Welcome back</h2>
        <p>Manage products, banners and customer orders for your store.</p>
        <ul>
          <li>✓ Add and edit products with photos</li>
          <li>✓ Update home page banners</li>
          <li>✓ Track and fulfil orders</li>
        </ul>
      </aside>

      <main className="login__panel">
        <form className="login__card" onSubmit={submit} noValidate>
          <h1>Admin login</h1>
          <p className="login__sub">Sign in with your email address</p>

          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <div className="passbox">
              <input
                id="email"
                type="text"
                autoComplete="username"
                placeholder="admin@123"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                data-testid={TEST_IDS?.adminLoginPhone}
              />
            </div>
            {errors.email && (
              <div className="field__error" id="email-error" role="alert">
                {errors.email}
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="passbox">
              <input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="123456"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                data-testid={TEST_IDS?.adminLoginPassword}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                data-testid={TEST_IDS?.adminLoginPasswordToggle}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <div className="field__error" id="password-error" role="alert">
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.95rem" }}
            disabled={busy}
            data-testid={TEST_IDS?.adminLoginSubmit}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <a href="/" className="login__back">
            ← Back to website
          </a>
        </form>
      </main>
    </div>
  );
}
