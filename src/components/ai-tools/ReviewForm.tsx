"use client";

import { useState } from "react";
import Link from "next/link";
import { INSTALL_URL } from "@/lib/site";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

// Lead capture under the top fixes: the team reviews the report and replies.
export function ReviewForm({ host, score, isShopify }: { host: string; score: number; isShopify: boolean }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get("email") as string).trim();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/ai-check/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, site: host, score }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <div className="review-card">
      <div style={{ flex: "1 1 260px" }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#fff" }}>Want a human to look at this?</p>
        <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--color-primary-chip)" }}>
          Get a free review of {host} from our team: what to fix first and how.{" "}
          {isShopify &&
            (INSTALL_URL ? (
              <a href={INSTALL_URL} rel="noopener" style={{ color: "#fff" }}>
                Or let the app fix it.
              </a>
            ) : (
              <Link href="/#features" style={{ color: "#fff" }}>
                On Shopify, our app fixes most of this for you.
              </Link>
            ))}
        </p>
      </div>
      <div style={{ flex: "1 1 280px" }}>
        {status.kind === "sent" ? (
          <p role="status" style={{ margin: 0, fontSize: 15, color: "#fff", fontWeight: 500 }}>
            Thanks! We&rsquo;ll reply within 1 business day.
          </p>
        ) : (
          <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <label htmlFor="review-email" className="sr-only">
              Email address
            </label>
            <input id="review-email" name="email" type="email" required autoComplete="email" placeholder="you@store.com" style={{ flex: "1 1 180px", minWidth: 0, height: 44 }} />
            <button type="submit" className="btn btn-white" style={{ height: 44, fontSize: 14.5 }} disabled={status.kind === "sending"}>
              {status.kind === "sending" ? "Sending…" : "Get my free review"}
            </button>
            {status.kind === "error" && (
              <span role="alert" style={{ flexBasis: "100%", fontSize: 13, color: "#ffd9d6" }}>
                {status.message}
              </span>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
