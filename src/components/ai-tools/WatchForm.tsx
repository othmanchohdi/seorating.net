"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; already: boolean } | { kind: "error"; message: string };

export function WatchForm({ host }: { host: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  return (
    <div className="report-card" style={{ padding: 22 }}>
      <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>Get told when this changes</p>
      <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--color-text-faint)" }}>
        We&rsquo;ll re-check {host} every week and email you only if the score moves or a new problem appears, like an AI
        crawler getting blocked. Free; stop anytime.
      </p>
      {status.kind === "sent" ? (
        <p role="status" style={{ margin: 0, fontSize: 14.5, color: "var(--color-ok)" }}>
          {status.already ? "You're already watching this site." : "Check your inbox to confirm. The link lasts 48 hours."}
        </p>
      ) : (
        <form
          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
          onSubmit={async (e) => {
            e.preventDefault();
            const email = (new FormData(e.currentTarget).get("email") as string).trim();
            setStatus({ kind: "sending" });
            try {
              const res = await fetch("/api/ai-check/monitor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ host, email }),
              });
              const body = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
              track("monitor_requested");
              setStatus({ kind: "sent", already: !!body.already });
            } catch (err) {
              setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
            }
          }}
        >
          <label htmlFor="watch-email" className="sr-only">
            Email address
          </label>
          <input id="watch-email" name="email" type="email" required autoComplete="email" placeholder="you@store.com" style={{ flex: "1 1 200px", minWidth: 0, height: 44 }} />
          <button type="submit" className="btn btn-dark" style={{ height: 44, fontSize: 14.5 }} disabled={status.kind === "sending"}>
            {status.kind === "sending" ? "Sending…" : "Watch weekly"}
          </button>
          {status.kind === "error" && (
            <span role="alert" style={{ flexBasis: "100%", fontSize: 13, color: "var(--color-bad)" }}>
              {status.message}
            </span>
          )}
        </form>
      )}
    </div>
  );
}
