import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "SEO Rating is a product of TheNextSprout, a Shopify and ecommerce agency.",
};

const VALUES = [
  {
    title: "Practitioners, not spectators",
    body: "Every feature started as something we were already doing manually for client stores. If it didn't survive real client work, it didn't make it into the app.",
  },
  {
    title: "AI as a starting point",
    body: "AI drafts meta tags, alt text and content suggestions quickly and well. It doesn't know your brand voice or your legal constraints, so everything it produces is yours to review before it publishes.",
  },
  {
    title: "No promises we can't keep",
    body: "We don't guarantee rankings, traffic or AI citations — nobody honestly can. What we can do is make sure your store is technically and editorially in the best shape to earn them.",
  },
  {
    title: "Transparent usage",
    body: "AI work costs money to run, so we meter it in credits you can see. You know the cost of an action before you take it, and there is no surprise invoice at the end of the month.",
  },
];

export default function About() {
  return (
    <>
      <section className="container" style={{ padding: "80px 24px 48px" }}>
        <span className="mono-label">About us</span>
        <h1 style={{ margin: "14px 0 0", maxWidth: 760, fontSize: 48, lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 600 }}>
          Built by an ecommerce agency, for the stores we work with every day.
        </h1>
        <p style={{ margin: "24px 0 0", maxWidth: 640, fontSize: 18.5, lineHeight: 1.6, color: "var(--color-text-soft)" }}>
          SEO Rating is a product of TheNextSprout, a Shopify and ecommerce agency. The tool exists
          because we needed it: the same SEO work, done by hand, across store after store — and more
          recently, the same new question from every merchant about being visible inside AI
          assistants.
        </p>
      </section>

      <section className="container" style={{ padding: "0 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{ border: "1px solid var(--color-border)", borderRadius: 14, padding: 26 }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                {v.title}
              </h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.62, color: "var(--color-text-softer)" }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ padding: "64px 24px 80px" }}>
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: 18,
            background: "var(--color-surface)",
            padding: 40,
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 28, lineHeight: 1.16, letterSpacing: "-0.02em", fontWeight: 600 }}>
              Where we&rsquo;re going
            </h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.62, color: "var(--color-text-soft)" }}>
              Today the app is Shopify-only, because that&rsquo;s where we work. A WordPress and
              WooCommerce version is planned but not available yet — the waitlist on the home page is
              the honest version of that timeline.
            </p>
          </div>
          <div style={{ minWidth: 240 }}>
            <span className="mono-label-muted">Talk to us</span>
            <p style={{ margin: "10px 0 14px", fontSize: 15, lineHeight: 1.6, color: "var(--color-ink-soft)" }}>
              Questions about the app, or about SEO work in general?
            </p>
            <a href="mailto:apps@thenextsprout.com" style={{ fontSize: 15, fontWeight: 600 }}>
              apps@thenextsprout.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
