import { CREDIT_COSTS, PLANS } from "@/lib/pricing";
import { INSTALL_URL } from "@/lib/site";

export function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="container section">
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="eyebrow">Pricing</span>
        <h2 id="pricing-title" className="h-section" style={{ marginBottom: 12 }}>
          Every tool on every plan. Start free.
        </h2>
        <p className="body" style={{ margin: 0 }}>
          Plans only change how much AI you can use each month. Billing goes through Shopify, and AI work is
          metered in credits, so you always see the cost before you run anything.
        </p>
      </div>

      <div className="pricing-grid">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`plan${plan.highlight ? " plan-featured" : ""}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{plan.name}</h3>
              {plan.highlight && <span className="chip">Most popular</span>}
            </div>
            <p style={{ margin: "6px 0 20px", fontSize: 14.5, color: "var(--color-text-softer)", minHeight: 44 }}>
              {plan.tagline}
            </p>
            <p className="plan-price">
              <strong>${plan.price}</strong>
              <span className="mono" style={{ fontSize: 12, color: "var(--color-text-faintest)" }}>
                / month
              </span>
            </p>
            <ul className="checklist">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a
              href={INSTALL_URL}
              rel="noopener"
              className={`btn btn-block ${plan.highlight ? "btn-primary" : "btn-secondary"}`}
              style={{ marginTop: 28, height: 46, fontSize: 15 }}
            >
              {plan.price === 0 ? "Install free" : `Start with ${plan.name}`}
            </a>
          </div>
        ))}
      </div>

      <details className="faq-item" style={{ marginTop: 24 }}>
        <summary>What does each AI action cost in credits?</summary>
        <div style={{ padding: "0 0 8px" }}>
          <table className="credit-table">
            <thead>
              <tr>
                <th scope="col">AI action</th>
                <th scope="col">Credits</th>
              </tr>
            </thead>
            <tbody>
              {CREDIT_COSTS.map((c) => (
                <tr key={c.action}>
                  <td>{c.action}</td>
                  <td>{c.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 14 }}>
            Audits, templates, structured data, robots.txt, sitemaps, broken-link checks, IndexNow and PageSpeed tests
            never use credits. Unused credits don&rsquo;t roll over.
          </p>
        </div>
      </details>

      <p className="mono" style={{ margin: "18px 0 0", textAlign: "center", fontSize: 12, color: "var(--color-text-faintest)" }}>
        Prices in USD, billed every 30 days through Shopify. Tax may apply based on your store&rsquo;s location.
      </p>
    </section>
  );
}
