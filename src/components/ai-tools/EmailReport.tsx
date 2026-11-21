"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Status = { kind: "closed" } | { kind: "open" } | { kind: "sending" } | { kind: "sent"; email: string } | { kind: "error"; message: string };

export function EmailReport({ host }: { host: string }) {
  const [status, setStatus] = useState<Status>({ kind: "closed" });

  if (status.kind === "closed") {
    return (
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStatus({ kind: "open" })}>
        Email me this report
      </button>
    );
  }
  if (status.kind === "sent") {
    return (
      <span role="status" style={{ fontSize: 13.5, color: "var(--color-ok)" }}>
        Sent to {status.email}.
      </span>
    );
  }

  return (
    <form
      style={{ display: "inline-flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}
      onSubmit={async (e) => {
        e.preventDefault();
        const email = (new FormData(e.currentTarget).get("email") as string).trim();
        setStatus({ kind: "sending" });
        try {
          const res = await fetch("/api/ai-check/email-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ host, email }),
          });
          if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Something went wrong.");
          track("report_emailed");
          setStatus({ kind: "sent", email });
        } catch (err) {
          setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
        }
      }}
    >
      <label htmlFor="email-report" className="sr-only">
        Email address
      </label>
      <input id="email-report" name="email" type="email" required autoFocus autoComplete="email" placeholder="you@store.com" style={{ height: 36, width: 200, fontSize: 14 }} />
      <button type="submit" className="btn btn-primary btn-sm" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Sending…" : "Send"}
      </button>
      {status.kind === "error" && (
        <span role="alert" style={{ flexBasis: "100%", fontSize: 12.5, color: "var(--color-bad)" }}>
          {status.message}
        </span>
      )}
    </form>
  );
}
