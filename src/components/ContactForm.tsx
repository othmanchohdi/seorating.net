"use client";

import { useState } from "react";
import { SUPPORT_EMAIL } from "@/lib/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), message: form.get("message") }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div role="status" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            background: "var(--color-primary-chip)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary)",
            fontSize: 17,
            fontWeight: 600,
          }}
        >
          ✓
        </div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em" }}>Message sent</h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-text-softer)" }}>
          Thanks. The team on shift will reply to the email you gave us. For anything urgent, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> directly.
        </p>
        <button onClick={() => setSent(false)} className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start", marginTop: 6 }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <h2 style={{ margin: "0 0 2px", fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em" }}>Send a message</h2>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required autoComplete="name" placeholder="Your name" />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@store.com" />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={6} required placeholder="What can we help with?" />
      </div>
      {error && (
        <span role="alert" style={{ fontSize: 13.5, color: "var(--color-bad)" }}>
          {error}
        </span>
      )}
      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? "Sending…" : "Send message"}
      </button>
      <span className="mono" style={{ fontSize: 11.5, lineHeight: 1.5, color: "var(--color-text-faintest)" }}>
        We only use what you send here to answer you.
      </span>
    </form>
  );
}
