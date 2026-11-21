"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { toHost } from "./CheckForm";

export function CompareForm({ initial = [], compact = false }: { initial?: string[]; compact?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const slots = [0, 1, 2];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const raw = slots.map((i) => ((data.get(`site${i}`) as string) ?? "").trim()).filter(Boolean);
        const hosts = raw.map(toHost);
        if (hosts.some((h) => !h)) return setError("One of those isn't a website address, like yourstore.com.");
        const unique = [...new Set(hosts as string[])];
        if (unique.length < 2) return setError("Enter at least two different sites.");
        setError(null);
        track("compare_requested", { sites: unique.length });
        router.push(`/ai-tools/compare?sites=${unique.join(",")}`);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {slots.map((i) => (
          <span key={i} style={{ flex: "1 1 170px", minWidth: 0, display: compact && i === 0 && initial[0] ? "none" : undefined }}>
            <label htmlFor={`cmp-${i}`} className="sr-only">
              {i === 0 ? "Your site" : `Competitor ${i}`}
            </label>
            <input
              id={`cmp-${i}`}
              name={`site${i}`}
              type="text"
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
              defaultValue={initial[i] ?? ""}
              placeholder={i === 0 ? "yourstore.com" : `competitor${i}.com${i === 2 ? " (optional)" : ""}`}
              style={{ width: "100%", height: 44 }}
            />
          </span>
        ))}
        <button type="submit" className="btn btn-primary" style={{ height: 44, fontSize: 14.5 }}>
          Compare
        </button>
      </div>
      {error && (
        <span role="alert" style={{ fontSize: 13, color: "var(--color-bad)" }}>
          {error}
        </span>
      )}
    </form>
  );
}
