import { ContactForm } from "@/components/ContactForm";
import { LocalTime, OnShiftBadge, ShiftTable } from "@/components/SupportClock";
import { JsonLd, ORG_ID, breadcrumbs } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { APP_STORE_NAME, COMPANY_NAME, SITE_NAME, SUPPORT_EMAIL, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact SEO Rating Support (24/7)",
  description: `Reach the ${SITE_NAME} team any time. Support for the Shopify app runs 24/7 across three shifts from Chicago and Monastir. Email ${SUPPORT_EMAIL} or send a message.`,
  path: "/contact",
});

const OFFICES = [
  { city: "Chicago", region: "United States", locality: "Chicago, Illinois, USA", tz: "America/Chicago", tzLabel: "Central Time (CT)", query: "Chicago, IL" },
  { city: "Monastir", region: "Tunisia", locality: "Monastir, Tunisia", tz: "Africa/Tunis", tzLabel: "Central European Time (CET)", query: "Monastir, Tunisia" },
];

export default function Contact() {
  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "ContactPage", url: absoluteUrl("/contact"), name: `Contact ${SITE_NAME}`, about: { "@id": ORG_ID } },
          breadcrumbs([{ name: "Contact", path: "/contact" }]),
        ]}
      />

      <section className="hero">
        <div className="container" style={{ padding: "clamp(48px,7vw,72px) 24px 64px" }}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "6px 13px 6px 10px",
              border: "1px solid #cfe6d6",
              background: "#fff",
              borderRadius: 999,
              width: "max-content",
              maxWidth: "100%",
              margin: "0 0 24px",
            }}
          >
            <span className="dot" style={{ background: "#3f8a5a", boxShadow: "0 0 0 4px var(--color-ok-bg)" }} />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-ok)" }}>Online now</span>
            <OnShiftBadge />
          </p>
          <span className="eyebrow">Contact us</span>
          <h1 className="h-display" style={{ marginTop: 14, maxWidth: 760 }}>
            Two offices. Three shifts. Always online.
          </h1>
          <p className="lead" style={{ maxWidth: 600 }}>
            Support, billing, feature requests or a problem with the app: a real person from our team is on shift 24
            hours a day, 7 days a week.
          </p>
        </div>
      </section>

      <section className="container" style={{ padding: "64px 24px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: 56, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <span className="mono-label-muted">Support email</span>
            <p style={{ margin: "8px 0 0", fontSize: 22, letterSpacing: "-0.01em" }}>
              <a href={`mailto:${SUPPORT_EMAIL}`} style={{ fontWeight: 600 }}>
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
          <div>
            <span className="mono-label-muted">Who you&rsquo;re writing to</span>
            <p style={{ margin: "8px 0 0", maxWidth: 440, fontSize: 15.5, lineHeight: 1.6, color: "var(--color-ink-soft)" }}>
              {COMPANY_NAME}, the company behind {SITE_NAME} (&ldquo;{APP_STORE_NAME}&rdquo; on the Shopify App Store).
            </p>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Support hours</h2>
              <span className="pill pill-ok">24 / 7</span>
            </div>
            <ShiftTable />
          </div>
        </div>

        <div className="card" style={{ borderRadius: 18, padding: "clamp(22px,3vw,32px)", boxShadow: "0 12px 32px -24px rgba(23,23,29,0.35)" }}>
          <ContactForm />
        </div>
      </section>

      <section className="container" style={{ padding: "56px 24px 96px" }}>
        <span className="eyebrow">Our offices</span>
        <h2 className="h-section" style={{ margin: "14px 0 32px", fontSize: "clamp(28px,3.6vw,38px)" }}>
          Chicago and Monastir
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 20 }}>
          {OFFICES.map((o) => (
            <article key={o.city} className="card" style={{ padding: 0, borderRadius: 20, overflow: "hidden" }}>
              {/* A styled map tile instead of an embedded Google Map: no third-party scripts or cookies on this page. */}
              <div
                aria-hidden="true"
                style={{
                  height: 200,
                  position: "relative",
                  background:
                    "radial-gradient(circle at 50% 55%, rgba(11,122,85,0.22) 0 10px, transparent 11px), radial-gradient(circle at 50% 55%, rgba(11,122,85,0.10) 0 60px, transparent 61px), repeating-linear-gradient(0deg, #eef3f0 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, #eef3f0 0 1px, transparent 1px 32px), #f7faf8",
                }}
              >
                <span style={{ position: "absolute", left: "50%", top: "55%", width: 14, height: 14, marginLeft: -7, marginTop: -7, borderRadius: 999, background: "var(--color-primary)", border: "3px solid #fff", boxShadow: "0 4px 10px rgba(11,122,85,0.4)" }} />
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 12px",
                    borderRadius: 10,
                    background: "#fff",
                    boxShadow: "0 6px 16px -8px rgba(23,23,29,0.35)",
                    fontSize: 12.5,
                  }}
                >
                  <span className="dot" style={{ background: "var(--color-primary)" }} />
                  <LocalTime timeZone={o.tz} />
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--color-text-faintest)" }}>
                    local
                  </span>
                </span>
              </div>
              <div style={{ padding: "26px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <span className="eyebrow">{o.region}</span>
                  <h3 style={{ margin: "6px 0 0", fontSize: 26, letterSpacing: "-0.02em", fontWeight: 600 }}>{o.city}</h3>
                </div>
                <address style={{ fontStyle: "normal", fontSize: 15, lineHeight: 1.55, color: "var(--color-ink-soft)" }}>{o.locality}</address>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", paddingTop: 14, borderTop: "1px solid var(--color-border-soft)", fontSize: 14 }}>
                  <span className="mono" style={{ fontSize: 12.5, color: "var(--color-text-faintest)" }}>
                    {o.tzLabel}
                  </span>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.query)}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
