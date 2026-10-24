import { pageMetadata } from "@/lib/metadata";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How SEO Rating collects, uses and protects data from your Shopify store, which providers process it, and how to delete it.",
  path: "/privacy",
});

const SECTIONS = [
  { id: "who-we-are", label: "1. Who we are" },
  { id: "what-we-collect", label: "2. What we collect" },
  { id: "why-we-collect", label: "3. Why we collect it" },
  { id: "who-we-share", label: "4. Who we share it with" },
  { id: "security", label: "5. Credentials and security" },
  { id: "retention", label: "6. Retention, deletion and your rights" },
  { id: "google-api", label: "7. Google API Services disclosure" },
  { id: "cookies", label: "8. Cookies and this website" },
  { id: "changes", label: "9. Changes and contact" },
];

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>{children}</p>;
}

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="[date placeholder — set when this is finalized and published]"
      sections={SECTIONS}
      draftNote="This document is built from the app's actual code and access scopes (see the facts cited throughout), but it still needs the legal entity name, registered address, governing law, and a qualified privacy-counsel review before publishing. Bracketed items are placeholders — nothing else on this page is invented."
    >
      <LegalSection id="who-we-are" title="1. Who we are">
        <P>
          SEO Rating (seorating.net), distributed on the Shopify App Store as &ldquo;TNS SEO &amp; AI
          Visibility&rdquo;, is built and operated by TheNextSprout. This policy explains what data
          the app collects from a merchant&rsquo;s store, why, who it is shared with, and how it can
          be deleted. Legal entity and registered address: [placeholder — legal entity name, country
          of incorporation/operation, and registered address pending].
        </P>
      </LegalSection>

      <LegalSection id="what-we-collect" title="2. What we collect">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <h3 style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 600 }}>Shopify store data</h3>
            <P>
              Store details (domain, shop name, plan) and the catalogue and content data the app
              needs to do its job, under the access scopes granted at install:
            </P>
            <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6, fontSize: 15, lineHeight: 1.6, color: "var(--color-text-softer)" }}>
              <li><code className="inline-code">read_products</code> / <code className="inline-code">write_products</code> — product titles, descriptions and images, to generate and save meta tags, image alt text, and handle/URL updates.</li>
              <li><code className="inline-code">read_content</code> / <code className="inline-code">write_content</code> — pages, blog posts and articles, for the same meta-tag tooling.</li>
              <li><code className="inline-code">read_files</code> / <code className="inline-code">write_files</code> — standalone uploaded files, for image alt text.</li>
              <li><code className="inline-code">read_themes</code> — read-only scan of your active theme to find image references missing alt text.</li>
              <li><code className="inline-code">write_themes</code> — reserved for an in-progress robots.txt publishing path; currently falls back to a manual setup step.</li>
              <li><code className="inline-code">write_online_store_navigation</code> — creates URL redirects when a page handle changes, and supports IndexNow URL-ownership verification.</li>
              <li><code className="inline-code">read_publications</code> — checks whether a collection is published, for the sitemap and broken-link tools.</li>
            </ul>
          </div>
          <div className="card">
            <h3 style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 600 }}>Google account data (only if you connect it)</h3>
            <P>
              If you connect Google Search Console, we request these OAuth scopes: your email
              address (<code className="inline-code">openid</code>,{" "}
              <code className="inline-code">userinfo.email</code>) to identify the connected account;{" "}
              <code className="inline-code">webmasters</code> to read your Search Console property
              data (queries, impressions, clicks, indexing status); and{" "}
              <code className="inline-code">siteverification.verify_only</code> to confirm you own
              the property you&rsquo;re connecting. Connecting Google is optional and can be
              disconnected at any time from inside the app, which permanently deletes the stored
              connection.
            </P>
          </div>
          <div className="card">
            <h3 style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 600 }}>Usage and account data</h3>
            <P>
              Which features you use, AI credit consumption and history, audit and optimization
              records, review/publish actions, plan and billing status from Shopify, support
              correspondence, and technical logs (timestamps, IP address, user agent, errors) used
              for security and debugging.
            </P>
          </div>
          <div className="card">
            <h3 style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 600 }}>Customer personal data</h3>
            <P>
              The app&rsquo;s features work on store content, not on your shoppers&rsquo; personal
              data — it does not read or write customer or order records, and no customer PII is
              stored by the app. See section 6 for exactly how the mandatory GDPR webhooks are
              handled given this.
            </P>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="why-we-collect" title="3. Why we collect it">
        <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 9, fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
          <li>To run the features you asked for: audits, tag and alt-text generation, structured data, discovery files, keyword research, performance reports.</li>
          <li>To generate AI drafts you review before publishing.</li>
          <li>To meter and display AI credit usage accurately, and to apply plan limits.</li>
          <li>To provide support and diagnose problems you report.</li>
          <li>To keep the service secure, prevent abuse, and comply with legal and platform obligations.</li>
        </ul>
        <P>
          We do not sell your data, and we do not use it to advertise to your shoppers. Lawful bases
          (contract performance, legitimate interests, consent for optional integrations): [to be
          confirmed with counsel].
        </P>
      </LegalSection>

      <LegalSection id="who-we-share" title="4. Who we share it with">
        <div style={{ border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
          {[
            ["Shopify", "The platform the app runs on and bills through. Store and content data is read from and written back to Shopify; subscription charges go through Shopify's Billing API."],
            ["Anthropic", "AI generation (meta tags, alt text, content drafts, article ideas). We send the specific product/page fields needed for that request — title, vendor, type, tags, price range, stripped description. No customer data is sent."],
            ["Google", "Search Console data retrieval and site-verification, only if you connect the integration; PageSpeed Insights audits of your public store URLs when you run a performance check. PageSpeed requests send only the public URL being tested."],
            ["DataForSEO", "Keyword research. Keyword terms plus location/language parameters are sent to retrieve volume and related-term data, funded by our own account, not billed to you directly."],
            ["Resend", "Transactional email. Used to deliver support/contact-form messages you send us."],
            ["Bing IndexNow", "If enabled, submits your store's public URLs (plus a verification key) so participating search engines can re-crawl faster. Google does not currently participate in IndexNow."],
            ["Sentry", "Error monitoring, only if configured. Receives error details and minimal context (such as which shop triggered an error) to help us fix bugs — not raw customer data."],
            ["Vercel", "Hosting and scheduled job infrastructure for the app itself."],
          ].map(([name, desc], i, arr) => (
            <div
              key={name}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(110px, 1fr) minmax(200px, 2.2fr)",
                padding: "16px 18px",
                borderBottom: i < arr.length - 1 ? "1px solid var(--color-border-soft)" : undefined,
                background: i === 0 ? "var(--color-surface)" : undefined,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600 }}>{name}</span>
              <span style={{ fontSize: 15, lineHeight: 1.6, color: "var(--color-text-softer)" }}>{desc}</span>
            </div>
          ))}
        </div>
        <P>
          Our database (Postgres, via Prisma) is hosted by our infrastructure provider and is not a
          separate data recipient — it stores the data described in section 2. Data may be processed
          outside your country; transfer safeguards: [placeholder — confirm with counsel].
        </P>
      </LegalSection>

      <LegalSection id="security" title="5. Credentials and security">
        <P>
          Google OAuth access and refresh tokens are encrypted at rest using AES-256-GCM before being
          stored, and are never displayed back to you in full or shared with other merchants. They
          are deleted immediately and completely when you disconnect Google or when Google reports
          the connection revoked. Your Shopify access token is stored using Shopify&rsquo;s standard
          app-session-storage library, which is how Shopify itself recommends apps store it; it is
          deleted when you uninstall the app.
        </P>
        <P>
          Data is transmitted over TLS. Access to production systems is restricted to personnel who
          need it. Additional technical and organisational measures: [placeholder].
        </P>
      </LegalSection>

      <LegalSection id="retention" title="6. Retention, deletion and your rights">
        <ul style={{ margin: "0 0 12px", padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 10, fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
          <li>
            <strong style={{ fontWeight: 600 }}>GDPR webhooks.</strong> The app implements
            Shopify&rsquo;s three mandatory privacy webhooks. Because the app never stores customer
            personal data,{" "}
            <code className="inline-code">customers/data_request</code> and{" "}
            <code className="inline-code">customers/redact</code> are acknowledged with no data to
            return or delete, since none is held.{" "}
            <code className="inline-code">shop/redact</code> deletes your store&rsquo;s session data
            immediately and your full store record shortly after (see below), which cascades to
            every record tied to your store — products, generation jobs, usage history, and any
            connected Google account.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Uninstalling.</strong> The moment you uninstall, your
            active session is deleted. Shopify sends us a shop-redaction request on its own schedule
            (typically within about 48 hours of uninstall), at which point your store&rsquo;s data is
            fully deleted. Between uninstall and that redaction, your store record is marked
            uninstalled but not yet purged.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Direct requests.</strong> Merchants and their
            customers can ask us directly to access, correct, export or delete data by emailing{" "}
            <a href="mailto:apps@thenextsprout.com">apps@thenextsprout.com</a>. Depending on where
            you live you may also have rights to object, restrict processing, or complain to a
            supervisory authority.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Logs.</strong> Technical logs are kept for a limited
            period for security and debugging, then deleted. Log retention: [placeholder].
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="google-api" title="7. Google API Services disclosure">
        <P>
          SEO Rating&rsquo;s use and transfer of information received from Google APIs adheres to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. We use Google Search Console data only to show
          you your own store&rsquo;s search performance inside the app, and we do not use it to train
          AI/ML models, nor share it except as described in section 4.
        </P>
      </LegalSection>

      <LegalSection id="cookies" title="8. Cookies and this website">
        <P>
          The app itself uses cookies or equivalent session storage needed to keep you signed in
          inside Shopify admin. This marketing website (seorating.net) does not set cookies or load
          any analytics or tracking script as currently built; if that changes, this section will be
          updated first.
        </P>
      </LegalSection>

      <LegalSection id="changes" title="9. Changes and contact">
        <P>
          We will update this policy as the app changes, and revise the &ldquo;last updated&rdquo;
          date; material changes will be communicated in the app or by email. Privacy inquiries:{" "}
          <a href="mailto:apps@thenextsprout.com">apps@thenextsprout.com</a>. Data protection contact
          / representative, where required: [placeholder].
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
