"use client";

import { useState } from "react";
import { adminFetch, setCsrf } from "@/lib/api";
import Logo from "@/components/Logo";
import { TEST_IDS } from "@/components/testIds";

export default function AdminLogin() {
  const [mode, setMode] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  const switchMode = () => {
    setMode(mode === "password" ? "otp" : "password");
    setErrors({});
    setError("");
    setInfo("");
    setOtpSent(false);
    setOtp("");
  };

  const finishLogin = (r) => {
    setCsrf(r.data?.csrf_token);
    // Hard navigation so the Next.js middleware sees the new session cookie
    window.location.href = "/admin";
  };

  const showError = (err) => {
    if (err.status === 401) setError(mode === "otp" ? "Invalid mobile number or OTP" : "Invalid email or password");
    else if (err.status === 422) setError(err.message || "Please check your login details");
    else setError("Can't reach the server. Please try again.");
  };

  async function submit(e) {
    e.preventDefault();
    setError("");
    const errs = {};

    if (mode === "password") {
      if (!email.trim()) errs.email = "Enter your email or mobile number";
      if (!password) errs.password = "Enter your password";
    } else {
      if (!/^\d{10}$/.test(phone)) errs.phone = "Enter your 10-digit mobile number";
      if (otpSent && !otp) errs.otp = "Enter the OTP";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      if (mode === "password") {
        const login = email.trim();
        const isPhone = /^\+?[\d\s-]+$/.test(login);
        finishLogin(
          await adminFetch("/admin/login", {
            method: "POST",
            body: isPhone ? { phone: login, password } : { email: login, password },
          }),
        );
        return;
      }

      if (!otpSent) {
        await adminFetch("/admin/otp/send", { method: "POST", body: { phone } });
        setOtpSent(true);
        setInfo(`OTP sent to +91 ${phone}`);
      } else {
        finishLogin(await adminFetch("/admin/otp/verify", { method: "POST", body: { phone, otp } }));
        return;
      }
    } catch (err) {
      showError(err);
    }
    setBusy(false);
  }

  const fieldError = (name) =>
    errors[name] && (
      <div className="field__error" id={`${name}-error`} role="alert">
        {errors[name]}
      </div>
    );

  return (
    <div className="login">
      <aside className="login__brand">
        <Logo className="login__logo" />
      </aside>

      <main className="login__panel">
        <form className="login__card" onSubmit={submit} noValidate>
          <h1>Admin login</h1>
          <p className="login__sub">
            {mode === "password" ? "Sign in with your email or mobile number" : "Sign in with a one-time password"}
          </p>

          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}
          {info && !error && (
            <div className="alert alert--success" role="status">
              {info}
            </div>
          )}

          {mode === "password" ? (
            <>
              <div className="field">
                <label htmlFor="email">Email or mobile</label>
                <div className="passbox">
                  <input
                    id="email"
                    type="text"
                    autoComplete="username"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    data-testid={TEST_IDS?.adminLoginPhone}
                  />
                </div>
                {fieldError("email")}
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="passbox">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
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
                {fieldError("password")}
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label htmlFor="phone">Mobile number</label>
                <div className="phonebox">
                  <span>+91</span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    readOnly={otpSent}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                </div>
                {fieldError("phone")}
              </div>

              {otpSent && (
                <div className="field">
                  <label htmlFor="otp">OTP</label>
                  <div className="passbox">
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      aria-invalid={!!errors.otp}
                      aria-describedby={errors.otp ? "otp-error" : undefined}
                      autoFocus
                    />
                  </div>
                  {fieldError("otp")}
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.95rem" }}
            disabled={busy}
            data-testid={TEST_IDS?.adminLoginSubmit}
          >
            {busy ? "Please wait…" : mode === "otp" && !otpSent ? "Send OTP" : mode === "otp" ? "Verify & sign in" : "Sign in"}
          </button>

          <button type="button" className="login__back login__switch" onClick={switchMode}>
            {mode === "password" ? "Sign in with OTP instead" : "Sign in with password instead"}
          </button>

          <a href="/" className="login__back">
            ← Back to website
          </a>
        </form>
      </main>
    </div>
  );
}
