import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the SEO Rating team at TheNextSprout.",
};

export default function Contact() {
  return (
    <section
      className="container"
      style={{
        padding: "80px 24px 88px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 56,
        alignItems: "start",
      }}
    >
      <div>
        <span className="mono-label">Contact us</span>
        <h1 style={{ margin: "14px 0 0", fontSize: 44, lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 600 }}>
          Get in touch
        </h1>
        <p style={{ margin: "20px 0 0", maxWidth: 460, fontSize: 17.5, lineHeight: 1.6, color: "var(--color-text-soft)" }}>
          Support questions, billing, feature requests, or a problem with the app — send it over and
          a human from the team will reply.
        </p>

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <span className="mono-label-muted">Support email</span>
            <p style={{ margin: "8px 0 0", fontSize: 16 }}>
              <a href="mailto:apps@thenextsprout.com" style={{ fontWeight: 600 }}>
                apps@thenextsprout.com
              </a>
            </p>
          </div>
          <div>
            <span className="mono-label-muted">Who you&rsquo;re writing to</span>
            <p style={{ margin: "8px 0 0", maxWidth: 420, fontSize: 15, lineHeight: 1.6, color: "var(--color-ink-soft)" }}>
              TheNextSprout, the company behind SEO Rating — listed on the Shopify App Store as
              &ldquo;TNS SEO &amp; AI Visibility&rdquo;.
            </p>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--color-border)", borderRadius: 18, padding: 32, boxShadow: "0 12px 32px -24px rgba(23,23,29,0.35)" }}>
        <ContactForm />
      </div>
    </section>
  );
}
