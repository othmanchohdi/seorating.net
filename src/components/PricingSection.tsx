import { PLANS } from "@/lib/pricing";

const INSTALL_URL = "https://apps.shopify.com/";

export function PricingSection() {
  return (
    <section id="pricing" className="container" style={{ padding: "80px 24px" }}>
      <div style={{ border: "1px solid var(--color-border)", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ padding: 32, borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
          <span className="mono-label">Pricing</span>
          <h2
            style={{
              margin: "12px 0 8px",
              fontSize: 34,
              lineHeight: 1.14,
              letterSpacing: "-0.025em",
              fontWeight: 600,
            }}
          >
            Four plans. Start free.
          </h2>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 16, lineHeight: 1.6, color: "var(--color-text-soft)" }}>
            Billing is handled by Shopify. AI usage is metered in credits so you only pay for what you
            actually generate — no plan change required to try a feature.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {PLANS.map((plan, i) => (
            <div
              key={plan.id}
              style={{
                padding: 28,
                borderRight: i < PLANS.length - 1 ? "1px solid var(--color-border)" : undefined,
                background: plan.highlight ? "#fdfdff" : undefined,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>{plan.name}</h3>
                {plan.highlight && <span className="chip" style={{ fontSize: 10 }}>Most popular</span>}
              </div>
              <p style={{ margin: "6px 0 18px", fontSize: 14, color: "var(--color-text-softer)" }}>
                {plan.tagline}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
                <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.03em" }}>{plan.price}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-faintest)" }}>
                  {plan.priceSuffix}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 13.5, color: "var(--color-ink-soft)" }}>
                {plan.features.map((feature) => (
                  <div key={feature} style={{ display: "flex", gap: 9 }}>
                    <span style={{ color: "var(--color-primary)", flexShrink: 0 }}>•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <a
                href={INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${plan.highlight ? "btn-primary" : "btn-secondary"}`}
                style={{ width: "100%", height: 42, marginTop: 22, fontSize: 14 }}
              >
                {plan.id === "free" ? "Install free" : "Install on Shopify"}
              </a>
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 32px", borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
          <span className="mono-label-muted">
            Prices shown in USD. Shopify may apply tax based on your store&rsquo;s location.
          </span>
        </div>
      </div>
    </section>
  );
}
