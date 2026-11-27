"use client";

import { useId, useState } from "react";
import { CheckRow, WidgetFrame } from "@/components/blog/WidgetFrame";
import { CopyButton } from "@/components/ai-tools/CopyButton";
import type { Finding } from "@/lib/seo/types";

// FAQPage and Organization JSON-LD generator. Runs in the browser.

type Qa = { q: string; a: string };

const SAMPLE_FAQ: Qa[] = [
  { q: "How long does shipping take?", a: "Orders ship within 1–2 business days. Standard delivery in the US takes 3–5 business days." },
  { q: "What is your return policy?", a: "Unworn items can be returned within 30 days for a full refund. Return shipping is free in the US." },
];

const ORG_FIELDS = [
  { key: "name", label: "Business name", placeholder: "Northfield" },
  { key: "url", label: "Website", placeholder: "https://northfield.com" },
  { key: "logo", label: "Logo URL", placeholder: "https://northfield.com/logo.png" },
  { key: "description", label: "One-line description", placeholder: "Linen clothing made in Portugal." },
  { key: "email", label: "Customer service email", placeholder: "help@northfield.com" },
  { key: "telephone", label: "Phone (with country code)", placeholder: "+1-555-010-0199" },
] as const;

type OrgKey = (typeof ORG_FIELDS)[number]["key"];

function faqJson(items: Qa[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .filter((i) => i.q.trim() && i.a.trim())
      .map((i) => ({ "@type": "Question", name: i.q.trim(), acceptedAnswer: { "@type": "Answer", text: i.a.trim() } })),
  };
}

function orgJson(o: Record<OrgKey, string>, sameAs: string[], type: string) {
  const clean = (v: string) => v.trim() || undefined;
  const social = sameAs.map((s) => s.trim()).filter(Boolean);
  const contact = clean(o.email) || clean(o.telephone) ? { "@type": "ContactPoint", contactType: "customer service", email: clean(o.email), telephone: clean(o.telephone) } : undefined;
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: clean(o.name),
    url: clean(o.url),
    logo: clean(o.logo),
    description: clean(o.description),
    sameAs: social.length ? social : undefined,
    contactPoint: contact,
  };
}

const script = (data: object) => `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;

export function SchemaGenerator() {
  const id = useId();
  const [kind, setKind] = useState<"faq" | "org">("faq");
  const [faq, setFaq] = useState<Qa[]>(SAMPLE_FAQ);
  const [org, setOrg] = useState<Record<OrgKey, string>>({ name: "Northfield", url: "https://northfield.com", logo: "https://northfield.com/logo.png", description: "", email: "", telephone: "" });
  const [orgType, setOrgType] = useState("OnlineStore");
  const [sameAs, setSameAs] = useState<string[]>(["https://www.instagram.com/northfield"]);

  const code = kind === "faq" ? script(faqJson(faq)) : script(orgJson(org, sameAs, orgType));

  const findings: Finding[] = [];
  if (kind === "faq") {
    const complete = faq.filter((i) => i.q.trim() && i.a.trim()).length;
    findings.push(complete ? { tone: "ok", text: `${complete} question${complete === 1 ? "" : "s"} included.` } : { tone: "bad", text: "Add at least one question and answer." });
    if (faq.some((i) => (i.q.trim() && !i.a.trim()) || (!i.q.trim() && i.a.trim()))) findings.push({ tone: "warn", text: "Some questions have no answer (or the reverse); they’re left out." });
    findings.push({ tone: "warn", text: "The same questions and answers must be visible on the page. Since 2023 Google shows FAQ rich results only for authoritative government and health sites, but AI assistants and other search engines still read this markup." });
  } else {
    findings.push(org.name.trim() && org.url.trim() ? { tone: "ok", text: "Name and website set." } : { tone: "bad", text: "Name and website are required." });
    findings.push(org.logo.trim() ? { tone: "ok", text: "Logo set. Use a square or wide image at least 112×112px on a plain background." } : { tone: "warn", text: "Add a logo URL so Google can show your logo in search and the knowledge panel." });
    if (!sameAs.some((s) => s.trim())) findings.push({ tone: "warn", text: "Add your social profiles (sameAs). They help search engines and AI assistants confirm which brand you are." });
    findings.push({ tone: "ok", text: "Add this to your homepage only. In Shopify, paste it into theme.liquid inside {% if template == 'index' %} … {% endif %}." });
  }

  return (
    <WidgetFrame
      title="Schema generator"
      badge={
        <span className="seg" role="group" aria-label="Schema type">
          <button type="button" aria-pressed={kind === "faq"} onClick={() => setKind("faq")}>
            FAQ
          </button>
          <button type="button" aria-pressed={kind === "org"} onClick={() => setKind("org")}>
            Organization
          </button>
        </span>
      }
      caption="Everything runs in your browser. Test the result in Google’s Rich Results Test before publishing."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 12 }}>
          {kind === "faq" ? (
            <>
              {faq.map((item, i) => (
                <fieldset key={i} style={{ border: "1px solid var(--color-border-soft)", borderRadius: 10, padding: 12, margin: 0, display: "grid", gap: 8 }}>
                  <legend className="tool-section-title" style={{ padding: "0 4px" }}>
                    Question {i + 1}
                  </legend>
                  <input aria-label={`Question ${i + 1}`} value={item.q} placeholder="Question" onChange={(e) => setFaq(faq.map((f, j) => (j === i ? { ...f, q: e.target.value } : f)))} />
                  <textarea aria-label={`Answer ${i + 1}`} value={item.a} placeholder="Answer" rows={2} onChange={(e) => setFaq(faq.map((f, j) => (j === i ? { ...f, a: e.target.value } : f)))} />
                  {faq.length > 1 && (
                    <button type="button" className="btn btn-secondary btn-sm" style={{ justifySelf: "start" }} onClick={() => setFaq(faq.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  )}
                </fieldset>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" style={{ justifySelf: "start" }} onClick={() => setFaq([...faq, { q: "", a: "" }])}>
                + Add question
              </button>
            </>
          ) : (
            <>
              <div className="field">
                <label htmlFor={`${id}-type`}>Type</label>
                <select id={`${id}-type`} value={orgType} onChange={(e) => setOrgType(e.target.value)}>
                  <option value="OnlineStore">OnlineStore (online-only shop)</option>
                  <option value="Organization">Organization</option>
                  <option value="LocalBusiness">LocalBusiness (has a physical store)</option>
                </select>
              </div>
              {ORG_FIELDS.map((f) => (
                <div key={f.key} className="field">
                  <label htmlFor={`${id}-${f.key}`}>{f.label}</label>
                  <input id={`${id}-${f.key}`} value={org[f.key]} placeholder={f.placeholder} onChange={(e) => setOrg({ ...org, [f.key]: e.target.value })} />
                </div>
              ))}
              <div className="field">
                <span style={{ fontWeight: 600, fontSize: 14 }}>Social profiles</span>
                {sameAs.map((s, i) => (
                  <input key={i} aria-label={`Social profile ${i + 1}`} value={s} placeholder="https://www.instagram.com/yourbrand" onChange={(e) => setSameAs(sameAs.map((v, j) => (j === i ? e.target.value : v)))} />
                ))}
                <button type="button" className="btn btn-secondary btn-sm" style={{ justifySelf: "start", width: "fit-content" }} onClick={() => setSameAs([...sameAs, ""])}>
                  + Add profile
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ display: "grid", gap: 12, minWidth: 0 }}>
          <div className="code-panel">
            <div className="code-panel-head">
              <span>{kind === "faq" ? "FAQPage" : orgType} JSON-LD</span>
              <CopyButton text={code} />
            </div>
            <pre style={{ maxHeight: 420, overflow: "auto", whiteSpace: "pre" }}>
              <code>{code}</code>
            </pre>
          </div>
          <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {findings.map((f) => (
              <CheckRow key={f.text} tone={f.tone}>
                {f.text}
              </CheckRow>
            ))}
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}
