"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, setCsrf } from "@/lib/api";
import { onlyDigits } from "@/lib/utils";
import Logo from "@/components/Logo";
import { TEST_IDS } from "@/components/testIds";

export default function AdminLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    const errs = {};
    if (!/^[6-9]\d{9}$/.test(phone))
      errs.phone = "Enter a valid 10-digit mobile number";
    if (!password) errs.password = "Enter your password";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const res = await adminFetch("/admin/login", {
        method: "POST",
        body: { phone, password },
      });
      setCsrf(res.data.csrf_token);
      router.replace("/admin");
    } catch (err) {
      if (err.status === 422 && err.errors) setErrors(err.errors);
      setError(err.message);
    } finally {
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
          <li>Add and edit products with photos</li>
          <li>Update home page banners</li>
          <li>Track and fulfil orders</li>
        </ul>
      </aside>
      <main className="login__panel">
        <form className="login__card" onSubmit={submit} noValidate>
          <h1>Admin login</h1>
          <p className="login__sub">Sign in with your mobile number</p>
          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}
          <div className="field">
            <label htmlFor="phone">Mobile number</label>
            <div className="phonebox">
              <span>+91</span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="username"
                placeholder="98765 43210"
                maxLength={10}
                value={phone}
                onChange={(e) =>
                  setPhone(onlyDigits(e.target.value).slice(0, 10))
                }
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                data-testid={TEST_IDS.adminLoginPhone}
              />
            </div>
            {errors.phone && (
              <div className="field__error" id="phone-error" role="alert">
                {errors.phone}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                data-testid={TEST_IDS.adminLoginPassword}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                data-testid={TEST_IDS.adminLoginPasswordToggle}
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
            className="btn"
            style={{ width: "100%", padding: "0.95rem" }}
            disabled={busy}
            data-testid={TEST_IDS.adminLoginSubmit}
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
