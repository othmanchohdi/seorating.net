import { WaitlistForm } from "@/components/WaitlistForm";
import { PricingSection } from "@/components/PricingSection";

const INSTALL_URL = "https://apps.shopify.com/";

const FEATURES = [
  {
    n: "01",
    title: "AI-ready discovery files",
    body: (
      <>
        Generate and maintain <code className="inline-code">llms.txt</code> and{" "}
        <code className="inline-code">agents.md</code> so AI assistants can read a clean, structured
        summary of your store.
      </>
    ),
  },
  {
    n: "02",
    title: "Robots.txt management",
    body: "Edit and manage crawler rules from inside the app — control what search engines and AI crawlers can reach.",
  },
  {
    n: "03",
    title: "SEO Tags",
    body: "AI-assisted and template-based meta titles and descriptions, applied across products, collections and pages.",
  },
  {
    n: "04",
    title: "Image Alt Tags",
    body: "AI-generated alt text that describes what's actually in the image, at catalogue scale.",
  },
  {
    n: "05",
    title: "Page Optimization",
    body: "A real on-page audit with an AI-assisted content optimizer, and a review-before-publish workflow so nothing changes without your sign-off.",
  },
  {
    n: "06",
    title: "Search Appearance",
    body: "JSON-LD structured data including Local Business schema, Google Search Console integration, and URL indexing submission.",
  },
  {
    n: "07",
    title: "Keyword Research",
    body: "Real keyword data wired directly into the content optimizer, plus an AI article idea generator for what to write next.",
  },
  {
    n: "08",
    title: "Store Performance",
    body: "Google PageSpeed Insights audits run against your live store, with the findings in plain language.",
  },
];

export default function Home() {
  return (
    <>
      <section className="container" style={{ padding: "88px 24px 64px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "5px 12px 5px 8px",
            border: "1px solid var(--color-primary-soft-border)",
            background: "var(--color-primary-soft)",
            borderRadius: 999,
            width: "max-content",
            marginBottom: 28,
          }}
        >
          <span className="chip">Shopify</span>
          <span style={{ fontSize: 13.5, color: "var(--color-text-soft)" }}>
            Available now on the Shopify App Store
          </span>
        </div>
        <h1
          style={{
            margin: 0,
            maxWidth: 880,
            fontSize: 58,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            fontWeight: 600,
          }}
        >
          The SEO tool built for how people actually search now — Google and AI both.
        </h1>
        <p style={{ margin: "26px 0 0", maxWidth: 640, fontSize: 19, lineHeight: 1.55, color: "var(--color-text-soft)" }}>
          SEO Rating is a Shopify app built from the ground up to also make your store genuinely
          discoverable and citable by AI assistants like ChatGPT, Perplexity and Gemini — connecting
          to Google Search Console and doing traditional SEO properly too.
        </p>
        <div id="install" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
          <a href={INSTALL_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Install on Shopify
          </a>
          <a href="#features" className="btn btn-secondary">
            See what it does
          </a>
        </div>
        <p style={{ margin: "16px 0 0", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--color-text-faintest)" }}>
          Listed on the Shopify App Store as &ldquo;TNS SEO &amp; AI Visibility&rdquo;
        </p>

        <div
          style={{
            marginTop: 56,
            border: "1px solid var(--color-border)",
            borderRadius: 16,
            background: "var(--color-surface-alt)",
            padding: 10,
            boxShadow: "0 12px 32px -18px rgba(23,23,29,0.25)",
          }}
        >
          <div
            style={{
              height: 400,
              borderRadius: 10,
              backgroundImage:
                "repeating-linear-gradient(135deg, #f1f0f8 0 10px, #e9e8f4 10px 20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#6a6a86" }}>
              app dashboard screenshot
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--color-text-faintest)" }}>
              drop a 2400×1000 capture here
            </span>
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
        <div
          className="container"
          style={{
            padding: "44px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 28,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-primary)" }} />
              <span className="mono-label">Available now</span>
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 600 }}>Shopify</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--color-text-softer)" }}>
              Installs into Shopify admin and works with your existing theme and products. Billing
              runs through Shopify.
            </p>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: "#b9b9c9" }} />
              <span className="mono-label-muted">Coming soon</span>
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 600 }}>WordPress &amp; WooCommerce</h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--color-text-softer)" }}>
              A WordPress/WooCommerce version is planned. It isn&rsquo;t available today — join the
              waitlist and we&rsquo;ll email you when it is.
            </p>
          </div>
          <div>
            <WaitlistForm />
          </div>
        </div>
      </section>

      <section id="features" className="container" style={{ padding: "80px 24px 24px" }}>
        <span className="mono-label">What&rsquo;s in the app</span>
        <h2 style={{ margin: "14px 0 0", maxWidth: 660, fontSize: 38, lineHeight: 1.12, letterSpacing: "-0.025em", fontWeight: 600 }}>
          Nine working tools, not a roadmap
        </h2>
        <p style={{ margin: "16px 0 0", maxWidth: 600, fontSize: 17, lineHeight: 1.6, color: "var(--color-text-soft)" }}>
          Everything listed below is live in the app today. Real data sources, real audits, and a
          review step before anything is published to your store.
        </p>

        <div style={{ marginTop: 44, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.n} className="card">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-faintest)" }}>
                {f.n}
              </span>
              <h3 style={{ margin: "10px 0 8px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                {f.title}
              </h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.62, color: "var(--color-text-softer)" }}>
                {f.body}
              </p>
            </div>
          ))}
          <div className="card" style={{ background: "var(--color-primary-soft)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8d84d8" }}>09</span>
            <h3 style={{ margin: "10px 0 8px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", color: "#2c2470" }}>
              AI Credits
            </h3>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.62, color: "#4a4470" }}>
              Transparent, pay-for-what-you-use AI usage. You see the credit cost before you run
              something — never a mystery bill.
            </p>
          </div>
        </div>
      </section>

      <PricingSection />

      <section style={{ borderTop: "1px solid var(--color-border)", background: "#17171d" }}>
        <div
          className="container"
          style={{
            padding: "72px 24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 28,
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ margin: 0, fontSize: 34, lineHeight: 1.14, letterSpacing: "-0.025em", fontWeight: 600, color: "#fff" }}>
              Get found by search engines and by AI.
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 16.5, lineHeight: 1.6, color: "#b8b8c8" }}>
              Install free, run your first audit, and see what your store looks like to both.
            </p>
          </div>
          <a
            href={INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ background: "#fff", color: "#17171d", height: 48, padding: "0 24px" }}
          >
            Install on Shopify
          </a>
        </div>
      </section>
    </>
  );
}
