"use client";

import { useState } from "react";
import { ScoreRing, WidgetFrame } from "./WidgetFrame";

type Field = {
  key: string;
  label: string;
  level: "Required" | "Recommended";
  theme: boolean; // typically output by a modern Shopify theme
  value: unknown;
};

// Levels follow Google's merchant listing documentation:
// https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
const FIELDS: Field[] = [
  { key: "name", label: "name", level: "Required", theme: true, value: "Relaxed Linen Shirt" },
  { key: "image", label: "image", level: "Required", theme: true, value: "https://northfield.com/…/shirt.jpg" },
  {
    key: "offers",
    label: "offers (price, currency, availability)",
    level: "Required",
    theme: true,
    value: { "@type": "Offer", price: "68.00", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  },
  { key: "description", label: "description", level: "Recommended", theme: true, value: "Lightweight 100% linen shirt with a relaxed fit." },
  { key: "brand", label: "brand", level: "Recommended", theme: true, value: { "@type": "Brand", name: "Northfield" } },
  { key: "sku", label: "sku", level: "Recommended", theme: true, value: "NF-LS-001" },
  { key: "gtin13", label: "gtin (from the barcode field)", level: "Recommended", theme: false, value: "5601234567890" },
  { key: "aggregateRating", label: "aggregateRating", level: "Recommended", theme: false, value: { "@type": "AggregateRating", ratingValue: "4.7", reviewCount: "128" } },
  {
    key: "shippingDetails",
    label: "shippingDetails",
    level: "Recommended",
    theme: false,
    value: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" } },
  },
  {
    key: "hasMerchantReturnPolicy",
    label: "hasMerchantReturnPolicy",
    level: "Recommended",
    theme: false,
    value: { "@type": "MerchantReturnPolicy", merchantReturnDays: 30 },
  },
];

const OFFER_CHILDREN = new Set(["shippingDetails", "hasMerchantReturnPolicy"]);

export function SchemaBuilder() {
  const [on, setOn] = useState<Set<string>>(() => new Set(FIELDS.filter((f) => f.theme).map((f) => f.key)));

  const toggle = (key: string) => {
    const next = new Set(on);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setOn(next);
  };

  const json: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Product" };
  for (const f of FIELDS) {
    if (!on.has(f.key) || OFFER_CHILDREN.has(f.key) || f.key === "offers") continue;
    json[f.key] = f.value;
  }
  if (on.has("offers")) {
    const offer: Record<string, unknown> = { ...(FIELDS.find((f) => f.key === "offers")!.value as object) };
    for (const k of OFFER_CHILDREN) if (on.has(k)) offer[k] = FIELDS.find((f) => f.key === k)!.value;
    json.offers = offer;
  }

  const required = FIELDS.filter((f) => f.level === "Required");
  const missingRequired = required.filter((f) => !on.has(f.key));
  const score = missingRequired.length ? Math.round((on.size / FIELDS.length) * 40) : 40 + Math.round(((on.size - required.length) / (FIELDS.length - required.length)) * 60);

  return (
    <WidgetFrame
      title="Product schema builder"
      badge={
        <span className="seg" role="group" aria-label="Presets">
          <button type="button" aria-pressed={on.size === FIELDS.filter((f) => f.theme).length && FIELDS.every((f) => f.theme === on.has(f.key))} onClick={() => setOn(new Set(FIELDS.filter((f) => f.theme).map((f) => f.key)))}>
            Typical theme
          </button>
          <button type="button" aria-pressed={on.size === FIELDS.length} onClick={() => setOn(new Set(FIELDS.map((f) => f.key)))}>
            Complete
          </button>
        </span>
      }
      caption="Toggle fields to see the JSON-LD change. Only mark up what shoppers can actually see on the page: a rating needs visible reviews, a return policy needs a real policy."
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <ScoreRing value={score} label="Coverage" size={104} />
        <div aria-live="polite" style={{ flex: "1 1 240px", fontSize: 14 }}>
          {missingRequired.length ? (
            <span className="pill pill-bad">Missing required: {missingRequired.map((f) => f.key).join(", ")}</span>
          ) : (
            <span className="pill pill-ok">Eligible for merchant listings</span>
          )}
          <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--color-text-softer)" }}>
            {on.size} of {FIELDS.length} fields. Fields marked <em>theme</em> are what most modern Shopify themes output already.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, alignItems: "start" }}>
        <fieldset style={{ border: 0, margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          <legend className="sr-only">Fields</legend>
          {FIELDS.map((f) => (
            <label key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, cursor: "pointer" }}>
              <input type="checkbox" checked={on.has(f.key)} onChange={() => toggle(f.key)} />
              <span className="mono" style={{ flex: 1, minWidth: 0, fontSize: 12.5 }}>
                {f.label}
              </span>
              {f.theme && (
                <span className="mono" style={{ fontSize: 10.5, color: "var(--color-text-faintest)" }}>
                  theme
                </span>
              )}
              <span className={`pill pill-${f.level === "Required" ? "warn" : "ok"}`} style={{ fontSize: 10.5 }}>
                {f.level === "Required" ? "Req." : "Rec."}
              </span>
            </label>
          ))}
        </fieldset>
        <div className="code-panel" style={{ minWidth: 0 }}>
          <div className="code-panel-head">
            <span>product.json-ld</span>
          </div>
          <pre style={{ fontSize: 11.5, maxHeight: 360, overflow: "auto" }}>{JSON.stringify(json, null, 2)}</pre>
        </div>
      </div>
    </WidgetFrame>
  );
}
