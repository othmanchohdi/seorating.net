import { pageMetadata } from "@/lib/metadata";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { COMPANY_LOCATION, COMPANY_NAME, COMPANY_URL, INVESTOR_NAME, LEGAL_UPDATED, SUPPORT_EMAIL } from "@/lib/site";

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
  { id: "google-user-data", label: "7. Google user data" },
  { id: "cookies", label: "8. Cookies and this website" },
  { id: "children", label: "9. Children" },
  { id: "changes", label: "10. Changes and contact" },
];

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>{children}</p>;
}

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated={LEGAL_UPDATED}
      sections={SECTIONS}
    >
      <LegalSection id="who-we-are" title="1. Who we are">
        <P>
          SEO Rating (seorating.net) is a Shopify app built and operated by <a href={COMPANY_URL} rel="noopener">{COMPANY_NAME}</a>{" "}
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;), based in {COMPANY_LOCATION}, with a team in Chicago, USA.
          {" "}{COMPANY_NAME} is the controller of the data described in this policy. This policy
          explains what data the app collects from a merchant&rsquo;s store, why, who it is shared
          with, and how it can be deleted.
        </P>
        <P>
          {INVESTOR_NAME} is an investment partner in {COMPANY_NAME}. It does not operate the app and
          does not receive merchant or store data.
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
              If you connect Google Search Console, we access your Google account email address and
              the Search Console data for the property you connect. Section 7 explains exactly what we
              access, why, how it is stored and shared, and how to delete it. Connecting Google is
              optional and can be disconnected at any time from inside the app.
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
          We do not sell or rent your data, and we do not use it to advertise to your shoppers. Where
          data protection law requires a legal basis, we rely on: performance of our contract with you
          (running the features you install and subscribe to); our legitimate interests (security,
          abuse prevention, support and improving the app); your consent (connecting Google Search
          Console, which you can withdraw at any time by disconnecting); and legal obligations (tax,
          accounting and responding to lawful requests).
        </P>
      </LegalSection>

      <LegalSection id="who-we-share" title="4. Who we share it with">
        <div style={{ border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
          {[
            ["Shopify", "The platform the app runs on and bills through. Store and content data is read from and written back to Shopify; subscription charges go through Shopify's Billing API."],
            ["Anthropic", "AI generation (meta tags, alt text, content drafts, article ideas). We send the specific product/page fields needed for that request — title, vendor, type, tags, price range, stripped description. No customer data is sent."],
            ["Google", "Search Console data, sitemap resubmission, URL inspection and domain verification, only if you connect the integration (see section 7); PageSpeed Insights audits of your public store URLs when you run a performance check. PageSpeed requests send only the public URL being tested."],
            ["DataForSEO", "Keyword research. Keyword terms plus location/language parameters are sent to retrieve volume and related-term data, funded by our own account, not billed to you directly."],
            ["Resend", "Transactional email. Delivers the contact-form and waitlist messages you send us from this website."],
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
          Our database (Prisma Postgres, provisioned through Vercel) is part of that hosting and is not a
          separate data recipient — it stores the data described in section 2. These providers may
          process data in the United States and other countries outside your own. Where data from the
          EEA, UK or Switzerland is transferred, we rely on the safeguards our providers offer, such as
          the European Commission&rsquo;s Standard Contractual Clauses. We may also disclose data if
          required by law, or to a successor if {COMPANY_NAME} or the app is merged or sold, in which
          case this policy continues to apply.
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
          Data is transmitted over TLS. Access to production systems is restricted to team members who
          need it to run and support the app, and application secrets are kept in our hosting
          provider&rsquo;s encrypted configuration rather than in source code. If a personal data
          breach affects you, we will notify you and the relevant authorities as the law requires.
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
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We reply within 1 business day and complete requests
            within 30 days. Depending on where you live you may also have rights to object, restrict
            processing, or complain to a supervisory authority, such as Tunisia&rsquo;s Instance
            Nationale de Protection des Données Personnelles (INPDP) or your local data protection
            authority.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Logs.</strong> Technical logs are kept for a limited
            period for security and debugging, and are deleted automatically within 90 days.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="google-user-data" title="7. Google user data">
        <P>
          SEO Rating&rsquo;s use and transfer of information received from Google APIs will adhere to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
            Google API Services User Data Policy
          </a>{" "}
          (https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use
          requirements.
        </P>
        <P>
          This section applies only if you choose to connect a Google account inside the app. Connecting
          Google is optional; every other feature works without it.
        </P>

        <h3 style={{ margin: "20px 0 8px", fontSize: 17, fontWeight: 600 }}>What we access</h3>
        {/* Scope list matches GOOGLE_OAUTH_SCOPES in the app repo's app/services/google-tokens.server.ts. */}
        <ul style={{ margin: "0 0 12px", padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 8, fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
          <li>
            <strong style={{ fontWeight: 600 }}>Your Google account email address</strong>, through the{" "}
            <code className="inline-code">openid</code> and <code className="inline-code">userinfo.email</code> scopes, so we can show you which
            account is connected.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Google Search Console data</strong> for the property you
            connect, through the <code className="inline-code">webmasters</code> scope: search performance (queries, pages,
            devices, clicks, impressions, click-through rate and average position), your sitemaps and
            their reported issues, and URL inspection results. The same scope lets the app add your store
            as a Search Console property and resubmit your sitemap.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Site verification</strong>, through the{" "}
            <code className="inline-code">siteverification.verify_only</code> scope, used only when you ask the app to verify
            your store&rsquo;s domain in Search Console. The app adds Google&rsquo;s verification tag to
            your storefront and asks Google to check it.
          </li>
        </ul>

        <h3 style={{ margin: "20px 0 8px", fontSize: 17, fontWeight: 600 }}>Why we use it</h3>
        <P>
          Only to provide features you use inside the app: showing you your own store&rsquo;s search
          performance, verifying your domain, resubmitting your sitemaps to Google, and inspecting the
          index status of your URLs. We do not use Google user data for any other purpose.
        </P>

        <h3 style={{ margin: "20px 0 8px", fontSize: 17, fontWeight: 600 }}>How it is stored</h3>
        <P>
          Google OAuth access and refresh tokens are encrypted at rest with AES-256-GCM before they are
          stored, and are never shown back to you in full or shared with other merchants. Data moves
          between your browser, our servers and Google over encrypted (TLS) connections.
        </P>
        <P>
          Search Console data and URL inspection results are not stored. The app fetches them from
          Google when you open the report or run an inspection, shows them to you, and keeps no copy in
          its database. The only Google data we store is your connected account&rsquo;s email address,
          the encrypted tokens, and the list of scopes Google granted.
        </P>

        <h3 style={{ margin: "20px 0 8px", fontSize: 17, fontWeight: 600 }}>Who it is shared with</h3>
        <ul style={{ margin: "0 0 12px", padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 8, fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
          <li>We never sell Google user data, and we never use it for advertising.</li>
          <li>
            It is processed only by the service providers we use to run the features above: Vercel,
            which hosts the app, and Prisma Postgres, which hosts its database. If a request to Google
            fails, our error monitoring service (Sentry) may receive Google&rsquo;s error message and
            your store&rsquo;s identifier so we can fix the problem. Google user data is never included
            in emails.
          </li>
          <li>Google user data is never sent to our AI provider.</li>
          <li>
            We may disclose it if the law requires, or to a successor if {COMPANY_NAME} or the app is
            merged or sold, in which case this policy continues to apply.
          </li>
        </ul>

        <h3 style={{ margin: "20px 0 8px", fontSize: 17, fontWeight: 600 }}>No AI training</h3>
        <P>
          Google user data is never used to develop, improve or train artificial intelligence or machine
          learning models, whether ours or anyone else&rsquo;s.
        </P>

        <h3 style={{ margin: "20px 0 8px", fontSize: 17, fontWeight: 600 }}>Human access</h3>
        <P>
          No person at {COMPANY_NAME} reads your Google user data, except when you give us explicit
          consent (for example, to help with a support request), when it is needed for security (such as
          investigating abuse or a vulnerability), or when the law requires it.
        </P>

        <h3 style={{ margin: "20px 0 8px", fontSize: 17, fontWeight: 600 }}>Retention</h3>
        <P>
          We keep your Google tokens only while your Google account is connected. They are deleted
          immediately when you disconnect Google in the app, when Google tells us the access was
          revoked, and when your store&rsquo;s data is deleted after you uninstall the app (on
          Shopify&rsquo;s redaction schedule, typically within about 48 hours). Your connected
          account&rsquo;s email address is deleted at the same time. If you start connecting Google but
          don&rsquo;t finish, the partial connection expires after 10 minutes and is deleted within a
          day. Search Console data isn&rsquo;t stored, so there is nothing else to delete.
        </P>

        <h3 style={{ margin: "20px 0 8px", fontSize: 17, fontWeight: 600 }}>How to delete it</h3>
        <ul style={{ margin: "0 0 12px", padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 8, fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
          <li>
            <strong style={{ fontWeight: 600 }}>Disconnect</strong> Google from Search Appearance inside
            the app. This permanently deletes the stored connection and tokens.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Uninstall</strong> the app from your Shopify admin. Your
            store&rsquo;s data, including any Google connection, is then deleted.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Revoke access</strong> from your Google Account at{" "}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
              https://myaccount.google.com/permissions
            </a>
            .
          </li>
          <li>
            Follow the steps on our <a href="/data-deletion">Data Deletion</a> page, or email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="cookies" title="8. Cookies and this website">
        <P>
          The app itself uses cookies or equivalent session storage needed to keep you signed in
          inside Shopify admin. This marketing website (seorating.net) does not set cookies or load
          any analytics or tracking script as currently built; if that changes, this section will be
          updated first.
        </P>
      </LegalSection>

      <LegalSection id="children" title="9. Children">
        <P>
          The app and this website are for businesses running Shopify stores. They are not directed at
          children, and we do not knowingly collect personal data from anyone under 16.
        </P>
      </LegalSection>

      <LegalSection id="changes" title="10. Changes and contact">
        <P>
          We will update this policy as the app changes, and revise the &ldquo;last updated&rdquo;
          date; material changes will be communicated in the app or by email.
        </P>
        <P>
          For any privacy question or request, including under the GDPR, UK GDPR, the CCPA or
          Tunisia&rsquo;s Organic Law No. 2004-63 on personal data protection, contact{" "}
          {COMPANY_NAME} at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
