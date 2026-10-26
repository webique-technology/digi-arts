"use client";
import { useState } from "react";
import FormField from "./FormField";
import { TEST_IDS } from "./testIds";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ busy: false, ok: false, error: "" });
  const set = (k) => (e) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[k];
      if (k === "phone" || k === "email") {
        delete next.contact;
        delete next.phone;
        delete next.email;
      }
      return next;
    });
  };

  async function submit(e) {
    e.preventDefault();
    setState({ busy: false, ok: false, error: "" });
    const nextErrors = {};
    if (!f.name.trim()) nextErrors.name = "Enter your name.";
    if (!f.phone.trim() && !f.email.trim())
      nextErrors.contact =
        "Enter a phone number or email address so we can reply.";
    if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (!f.message.trim()) nextErrors.message = "Tell us how we can help.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }
    setState({ busy: true, ok: false, error: "" });
    try {
      const payload = {
        ...f,
        name: f.name.trim(),
        phone: f.phone.trim(),
        email: f.email.trim(),
        message: f.message.trim(),
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        if (res.status === 422 && json.data) setErrors(json.data);
        throw new Error(json.message || "Could not send your message");
      }
      setF({ name: "", phone: "", email: "", message: "" });
      setState({ busy: false, ok: true, error: "" });
    } catch (err) {
      setState({ busy: false, ok: false, error: err.message });
    }
  }
  return (
    <form
      className="contactform rounded-4"
      onSubmit={submit}
      noValidate
      aria-labelledby="contact-form-title"
    >
      <div className="contactform__intro">
        <small>We’re here to help</small>
        <h2 id="contact-form-title">Send us a message</h2>
        <p>
          Share a few details and include your preferred way for us to reply.
        </p>
      </div>
      {state.ok && (
        <div className="alert alert--ok" role="status">
          Thanks! We’ve received your message and will get back to you soon.
        </div>
      )}
      {state.error && (
        <div className="alert alert--error" role="alert">
          {state.error}
        </div>
      )}
      {errors.contact && (
        <div className="alert alert--error" role="alert">
          {errors.contact}
        </div>
      )}
      <div className="form-grid">
        <FormField
          id="c-name"
          label="Name *"
          autoComplete="name"
          value={f.name}
          onChange={set("name")}
          error={errors.name}
          required
          data-testid={TEST_IDS.contactName}
        />
        <FormField
          id="c-phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={f.phone}
          onChange={set("phone")}
          error={errors.phone}
          data-testid={TEST_IDS.contactPhone}
        />
        <FormField
          id="c-email"
          className="full"
          label="Email address"
          type="email"
          autoComplete="email"
          value={f.email}
          onChange={set("email")}
          error={errors.email}
          data-testid={TEST_IDS.contactEmail}
        />
        <FormField
          id="c-message"
          className="full"
          as="textarea"
          label="How can we help? *"
          value={f.message}
          onChange={set("message")}
          maxLength={2000}
          error={errors.message}
          required
          data-testid={TEST_IDS.contactMessage}
        />
      </div>
      <div className="contactform__actions">
        <span>Phone or email is required for a reply.</span>
        <button
          className="btn"
          type="submit"
          disabled={state.busy}
          data-testid={TEST_IDS.contactSubmit}
        >
          {state.busy ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
