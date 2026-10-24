"use client";

import { useState } from "react";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; email: string } | { kind: "error"; message: string };

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get("email") as string).trim();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setStatus({ kind: "sent", email });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  const note =
    status.kind === "sent"
      ? `Thanks, we’ll email ${status.email} when the WordPress version is ready.`
      : status.kind === "error"
        ? status.message
        : "No spam. One email when it launches.";
  const noteColor = status.kind === "sent" ? "var(--color-ok)" : status.kind === "error" ? "var(--color-bad)" : "var(--color-text-faintest)";

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 260, maxWidth: 420 }}>
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@store.com"
          style={{ flex: 1, minWidth: 170 }}
        />
        <button type="submit" className="btn btn-dark" style={{ height: 44, fontSize: 14.5 }} disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Notify me"}
        </button>
      </div>
      <span role="status" style={{ fontSize: 12.5, color: noteColor }}>
        {note}
      </span>
    </form>
  );
}
