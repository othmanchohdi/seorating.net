"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Mirrors toHostname() in lib/ai-check/net.ts, without the Node imports.
function toHost(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const host = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).hostname.toLowerCase().replace(/\.$/, "");
    return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host) ? host : null;
  } catch {
    return null;
  }
}

export function CheckForm({ initial = "", size = "lg", buttonLabel = "Check my site" }: { initial?: string; size?: "lg" | "sm"; buttonLabel?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const h = size === "lg" ? 50 : 42;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const host = toHost(new FormData(e.currentTarget).get("site") as string);
        if (!host) return setError("Enter a website address, like yourstore.com.");
        setError(null);
        setPending(true);
        router.push(`/ai-tools/report/${host}`);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label htmlFor={`site-${size}`} className="sr-only">
          Website address
        </label>
        <input
          id={`site-${size}`}
          name="site"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          defaultValue={initial}
          placeholder="yourstore.com"
          aria-invalid={!!error}
          aria-describedby={error ? `site-${size}-error` : undefined}
          style={{ flex: "1 1 220px", minWidth: 0, width: "auto", height: h, fontSize: size === "lg" ? 16 : 14.5 }}
        />
        <button type="submit" className="btn btn-primary" style={{ height: h, fontSize: size === "lg" ? 15.5 : 14.5 }} disabled={pending}>
          {pending ? "Starting…" : buttonLabel}
        </button>
      </div>
      {error && (
        <span id={`site-${size}-error`} role="alert" style={{ fontSize: 13, color: "var(--color-bad)" }}>
          {error}
        </span>
      )}
    </form>
  );
}
