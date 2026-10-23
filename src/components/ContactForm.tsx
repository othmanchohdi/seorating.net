"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
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
          Thanks — we&rsquo;ll reply to the email you gave us. For anything urgent, email{" "}
          <a href="mailto:apps@thenextsprout.com">apps@thenextsprout.com</a> directly.
        </p>
        <button onClick={() => setSent(false)} className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start", marginTop: 6 }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Field id="name" label="Name" placeholder="Your name" />
      <Field id="email" label="Email" type="email" placeholder="you@store.com" />
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <label htmlFor="message" style={{ fontSize: 13.5, fontWeight: 500, color: "var(--color-ink-soft)" }}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="What can we help with?"
          style={{ padding: "12px 13px", fontSize: 15, lineHeight: 1.55, resize: "vertical" }}
        />
      </div>
      {error && <span style={{ fontSize: 13.5, color: "#b4452e" }}>{error}</span>}
      <button type="submit" disabled={submitting} className="btn btn-primary" style={{ height: 46 }}>
        {submitting ? "Sending…" : "Send message"}
      </button>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.5, color: "var(--color-text-faintest)" }}>
        We only use what you send here to answer you.
      </span>
    </form>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label htmlFor={id} style={{ fontSize: 13.5, fontWeight: 500, color: "var(--color-ink-soft)" }}>
        {label}
      </label>
      <input id={id} name={id} type={type} required placeholder={placeholder} style={{ height: 44, padding: "0 13px", fontSize: 15 }} />
    </div>
  );
}
