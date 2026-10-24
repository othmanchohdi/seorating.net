import Link from "next/link";
import { JsonLd, ORG_ID, breadcrumbs } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { COMPANY_NAME, SITE_NAME, SUPPORT_EMAIL, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About SEO Rating",
  description: `${SITE_NAME} is built by ${COMPANY_NAME}, a Shopify and ecommerce agency. Every feature started as SEO work we did by hand for client stores, now with AI search built in.`,
  path: "/about",
});

const RULES = [
  ["Practitioners, not spectators", "If a feature didn’t survive real client work, it didn’t make it into the app."],
  ["AI drafts, you decide", "AI is fast at meta tags and alt text. It doesn’t know your brand voice, so nothing publishes without your review."],
  ["No promises we can’t keep", "Nobody can honestly guarantee rankings or AI citations. We make your store as ready as possible to earn them."],
  ["Transparent usage", "AI costs are metered in credits you can see before you act. No surprise invoice."],
];

const STAGES = [
  { label: "Before", title: "Done by hand", body: "Spreadsheets of products, meta tags written one at a time, schema pasted into theme files." },
  { label: "Then", title: "Internal scripts", body: "We automated the audits and fixes for our own client work, and kept the review step." },
  { label: "Now", title: SITE_NAME, body: "The same toolkit, packaged as a Shopify app, with AI search built in from day one.", highlight: true },
];

export default function About() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: absoluteUrl("/about"),
            name: `About ${SITE_NAME}`,
            about: { "@id": ORG_ID },
          },
          breadcrumbs([{ name: "About", path: "/about" }]),
        ]}
      />

      <section style={{ background: "var(--color-primary)", color: "#fff", overflow: "hidden", position: "relative" }}>
        <div aria-hidden="true" style={{ position: "absolute", right: -120, top: -120, width: 520, height: 520, borderRadius: 999, border: "1px solid rgba(255,255,255,0.14)" }} />
        <div aria-hidden="true" style={{ position: "absolute", right: -40, top: -40, width: 360, height: 360, borderRadius: 999, border: "1px solid rgba(255,255,255,0.14)" }} />
        <div className="container" style={{ position: "relative", padding: "clamp(64px,9vw,96px) 24px clamp(72px,10vw,104px)" }}>
          <span className="eyebrow" style={{ color: "#c9f2dd", fontSize: 12 }}>
            About {SITE_NAME}
          </span>
          <h1 style={{ margin: "18px 0 0", maxWidth: 960, fontSize: "clamp(40px,7vw,68px)", lineHeight: 1.0, letterSpacing: "-0.035em", fontWeight: 600 }}>
            We built the tool we kept wishing we had.
          </h1>
          <p style={{ margin: "28px 0 0", maxWidth: 620, fontSize: "clamp(17px,2vw,19.5px)", lineHeight: 1.55, color: "var(--color-primary-chip)" }}>
            {SITE_NAME} is a product of {COMPANY_NAME}, a Shopify and ecommerce agency. Every feature started as work we
            were doing by hand for client stores.
          </p>
        </div>
      </section>

      <section className="container split" style={{ padding: "96px 24px 40px", alignItems: "start", gap: 64 }}>
        <div>
          <span className="eyebrow">Why it exists</span>
          <h2 className="h-section">The same SEO work, store after store. Then a new question.</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 17.5, lineHeight: 1.65, color: "var(--color-ink-soft)" }}>
          <p style={{ margin: 0 }}>
            For years our team fixed the same problems on every Shopify store we touched: missing meta descriptions,
            empty alt text, broken schema, slow pages. It was important work, and almost all of it was repetitive.
          </p>
          <p style={{ margin: 0 }}>
            Then merchants started asking something new:{" "}
            <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>&ldquo;Why doesn&rsquo;t ChatGPT mention us?&rdquo;</strong>{" "}
            Existing SEO tools only looked at Google. So we built one that looks at both.
          </p>
        </div>
      </section>

      <section className="container" style={{ padding: "40px 24px 96px" }}>
        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid var(--color-border)",
            borderRadius: 24,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))",
          }}
        >
          {STAGES.map((s, i) => (
            <li
              key={s.label}
              style={{
                padding: 32,
                borderRight: i < STAGES.length - 1 ? "1px solid var(--color-border)" : undefined,
                background: s.highlight ? "var(--color-primary-soft)" : i === 0 ? "var(--color-surface)" : undefined,
              }}
            >
              <span className="mono" style={{ fontSize: 12, color: s.highlight ? "var(--color-primary)" : "var(--color-text-faintest)" }}>
                {s.label}
              </span>
              <h3 style={{ margin: "12px 0 8px", fontSize: 20, fontWeight: 600, color: s.highlight ? "var(--color-primary-deep)" : undefined }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: s.highlight ? "var(--color-primary-deep-soft)" : "var(--color-text-softer)" }}>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section style={{ background: "var(--color-dark)", color: "#fff" }}>
        <div className="container section">
          <span className="eyebrow" style={{ color: "var(--color-mint)" }}>
            What we believe
          </span>
          <h2 className="h-section" style={{ margin: "14px 0 48px", maxWidth: 620 }}>
            Four rules the app is built on
          </h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {RULES.map(([title, body], i) => (
              <li
                key={title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))",
                  gap: "8px 32px",
                  padding: "28px 0",
                  borderTop: "1px solid var(--color-dark-border)",
                  borderBottom: i === RULES.length - 1 ? "1px solid var(--color-dark-border)" : undefined,
                  alignItems: "baseline",
                }}
              >
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em" }}>
                  <span className="mono" style={{ fontSize: 14, color: "var(--color-mint)", marginRight: 16, fontWeight: 400 }}>
                    0{i + 1}
                  </span>
                  {title}
                </h3>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--color-dark-text)" }}>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container split" style={{ padding: "96px 24px 48px", gap: 48 }}>
        <div
          aria-hidden="true"
          style={{
            aspectRatio: "4/3",
            borderRadius: 20,
            background: "var(--color-primary-soft)",
            border: "1px solid var(--color-primary-soft-border)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            padding: "clamp(18px,3vw,32px)",
          }}
        >
          {[
            ["Shopify", "Live today", true],
            ["WordPress", "Planned", false],
            ["WooCommerce", "Planned", false],
            ["AI search", "Built in", true],
          ].map(([name, status, live]) => (
            <div key={name as string} className="mock" style={{ padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontSize: "clamp(15px,2vw,19px)", fontWeight: 600 }}>{name}</span>
              <span className={`pill ${live ? "pill-ok" : ""}`} style={{ alignSelf: "flex-start", background: live ? undefined : "#f4f4f8", color: live ? undefined : "var(--color-text-softer)" }}>
                {status}
              </span>
            </div>
          ))}
        </div>
        <div>
          <span className="eyebrow">Where we&rsquo;re going</span>
          <h2 className="h-feature">Shopify today. WordPress next.</h2>
          <p className="body">
            The app is Shopify-only because that&rsquo;s where we work. A WordPress and WooCommerce version is planned but
            not available yet. The waitlist on the home page is the honest version of that timeline.
          </p>
          <Link href="/#waitlist" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, fontSize: 15.5, fontWeight: 600 }}>
            Join the waitlist →
          </Link>
        </div>
      </section>

      <section style={{ padding: "48px 16px 96px" }}>
        <div
          className="container card-soft"
          style={{
            borderRadius: 24,
            border: "1px solid var(--color-primary-soft-border)",
            padding: "56px clamp(20px,4vw,40px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 28,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ margin: 0, fontSize: "clamp(26px,3.4vw,34px)", lineHeight: 1.14, letterSpacing: "-0.025em", fontWeight: 600, color: "var(--color-primary-deep)" }}>
              Talk to the people who built it.
            </h2>
            <p style={{ margin: "12px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "var(--color-primary-deep-soft)" }}>
              Questions about the app, or about SEO work in general. We read every email.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="btn btn-primary">
              {SUPPORT_EMAIL}
            </a>
            <Link href="/contact" className="btn btn-secondary">
              Contact page
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
