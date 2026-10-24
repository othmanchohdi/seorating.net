"use client";

import Link from "next/link";
import { useState } from "react";

export type PostCard = {
  slug: string;
  title: string;
  description: string;
  category: string;
  meta: string;
  cover: React.ReactNode;
};

export function BlogGrid({ posts, categories }: { posts: PostCard[]; categories: string[] }) {
  const [current, setCurrent] = useState("All");
  const shown = current === "All" ? posts : posts.filter((p) => p.category === current);

  return (
    <>
      <div role="group" aria-label="Filter by topic" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        {["All", ...categories].map((c) => {
          const on = c === current;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => setCurrent(c)}
              style={{
                height: 36,
                padding: "0 14px",
                borderRadius: 999,
                border: `1px solid ${on ? "var(--color-primary)" : "var(--color-input-border)"}`,
                background: on ? "var(--color-primary)" : "#fff",
                color: on ? "#fff" : "var(--color-ink-soft)",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,320px),1fr))", gap: 24 }}>
        {shown.map((p) => (
          <li key={p.slug} style={{ display: "flex" }}>
            <Link href={`/blog/${p.slug}`} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", width: "100%" }}>
              <div style={{ aspectRatio: "16/9" }}>{p.cover}</div>
              <article style={{ padding: 22, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <span className="mono" style={{ fontSize: 11.5, color: "var(--color-primary)" }}>
                  {p.category}
                </span>
                <h3 style={{ margin: 0, fontSize: 19, lineHeight: 1.3, letterSpacing: "-0.012em", fontWeight: 600 }}>{p.title}</h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--color-text-softer)", flex: 1 }}>{p.description}</p>
                <span className="mono" style={{ fontSize: 12, color: "var(--color-text-faintest)" }}>
                  {p.meta}
                </span>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
