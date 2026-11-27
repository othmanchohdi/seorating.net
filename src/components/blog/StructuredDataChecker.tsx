"use client";

import { useId, useState } from "react";
import { CheckRow, WidgetFrame, type Tone } from "./WidgetFrame";

type JsonLdNode = Record<string, unknown>;
const typesOf = (node: JsonLdNode): string[] => {
  const t = node["@type"];
  return (Array.isArray(t) ? t : [t]).filter((v): v is string => typeof v === "string");
};

const SAMPLE_NODES: JsonLdNode[] = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Relaxed Linen Shirt",
    image: "https://northfield.com/…/shirt.jpg",
    brand: { "@type": "Brand", name: "Northfield" },
    offers: { "@type": "Offer", price: "68.00", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  },
];

type Check = { tone: Tone; text: string };

function findings(nodes: JsonLdNode[], invalid: boolean): Check[] {
  if (invalid) return [{ tone: "bad", text: "A JSON-LD block on this page doesn't parse as valid JSON, so it's ignored entirely." }];
  if (!nodes.length) return [{ tone: "bad", text: "No JSON-LD structured data found on this page." }];

  const types = new Set(nodes.flatMap(typesOf));
  const checks: Check[] = [{ tone: "ok", text: `Found ${nodes.length} block${nodes.length === 1 ? "" : "s"}: ${[...types].join(", ")}.` }];

  const product = nodes.find((n) => typesOf(n).includes("Product"));
  if (product) {
    const offer = (Array.isArray(product.offers) ? product.offers[0] : product.offers) as JsonLdNode | undefined;
    const missing = [!product.image && "image", !offer?.price && "price", !offer?.priceCurrency && "currency", !offer?.availability && "availability"].filter(Boolean);
    checks.push(
      missing.length
        ? { tone: "bad", text: `Product is missing ${missing.join(", ")}. Price and availability are required for merchant listings.` }
        : { tone: "ok", text: "Product has price, currency and availability." },
    );
    checks.push(
      product.brand ? { tone: "ok", text: "Brand is set." } : { tone: "warn", text: "No brand set." },
      (product as JsonLdNode).aggregateRating
        ? { tone: "ok", text: "Ratings are marked up." }
        : { tone: "warn", text: "No aggregateRating. Only add this if reviews are visible on the page." },
    );
  }

  const hasOrg = [...types].some((t) => /^(Organization|OnlineStore|Store|LocalBusiness|Corporation|Brand)$/.test(t));
  if (!hasOrg) checks.push({ tone: "warn", text: "No Organization-type block. Usually only expected on the homepage." });
  const hasBreadcrumb = types.has("BreadcrumbList");
  checks.push(hasBreadcrumb ? { tone: "ok", text: "BreadcrumbList found." } : { tone: "warn", text: "No BreadcrumbList. It shows the page's place in your store instead of a raw URL." });

  return checks;
}

type FetchStatus = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string } | { kind: "done"; finalUrl: string };

export function StructuredDataChecker() {
  const id = useId();
  const [url, setUrl] = useState("");
  const [nodes, setNodes] = useState<JsonLdNode[]>(SAMPLE_NODES);
  const [invalid, setInvalid] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({ kind: "idle" });
  const checks = findings(nodes, invalid);

  async function fetchSchema(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = url.trim();
    if (!target || fetchStatus.kind === "loading") return;
    setFetchStatus({ kind: "loading" });
    try {
      const res = await fetch(`/api/schema-fetch?url=${encodeURIComponent(target)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Couldn't read that page.");
      setNodes(body.nodes ?? []);
      setInvalid(!!body.invalid);
      setFetchStatus({ kind: "done", finalUrl: body.finalUrl });
    } catch (err) {
      setFetchStatus({ kind: "error", message: err instanceof Error ? err.message : "Couldn't read that page." });
    }
  }

  const bad = checks.filter((c) => c.tone === "bad").length;

  return (
    <WidgetFrame
      title="Structured data checker"
      badge={<span className={`pill pill-${bad ? "bad" : "ok"}`}>{bad ? `${bad} problem${bad === 1 ? "" : "s"}` : "Looks good"}</span>}
      caption="Reads the JSON-LD a crawler actually receives, no JavaScript run. Example data is shown until you fetch your own URL."
    >
      <form onSubmit={fetchSchema} className="field">
        <label htmlFor={`${id}-url`}>Page URL</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            id={`${id}-url`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourstore.com/products/linen-shirt"
            spellCheck={false}
            style={{ flex: "1 1 260px", fontFamily: "var(--font-mono)", fontSize: 13.5 }}
          />
          <button type="submit" className="btn btn-secondary btn-sm" disabled={fetchStatus.kind === "loading" || !url.trim()}>
            {fetchStatus.kind === "loading" ? "Reading…" : "Check page"}
          </button>
        </div>
        <span role="status" style={{ fontSize: 12.5, color: fetchStatus.kind === "error" ? "var(--color-bad)" : "var(--color-text-faintest)" }}>
          {fetchStatus.kind === "error"
            ? fetchStatus.message
            : fetchStatus.kind === "done"
              ? `Read ${fetchStatus.finalUrl}. Nothing is saved on our end.`
              : "Works on any page: product, collection, homepage or blog post."}
        </span>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {checks.map((c) => (
          <CheckRow key={c.text} tone={c.tone}>
            {c.text}
          </CheckRow>
        ))}
      </div>

      {nodes.length > 0 && (
        <div className="code-panel" style={{ minWidth: 0 }}>
          <div className="code-panel-head">
            <span>structured-data.json-ld</span>
          </div>
          <pre style={{ fontSize: 11.5, maxHeight: 320, overflow: "auto" }}>{JSON.stringify(nodes, null, 2)}</pre>
        </div>
      )}
    </WidgetFrame>
  );
}
