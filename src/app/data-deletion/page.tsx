import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Data Deletion",
  description: "How to delete your SEO Rating data and revoke Google access.",
};

const SECTIONS = [
  { id: "delete-store-data", label: "1. Delete your store data" },
  { id: "revoke-google", label: "2. Revoke Google access" },
  { id: "what-happens", label: "3. What happens to your data" },
  { id: "customer-requests", label: "4. Requests from your customers" },
];

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>{children}</p>;
}

export default function DataDeletion() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Data Deletion"
      lastUpdated="[date placeholder]"
      sections={SECTIONS}
    >
      <LegalSection id="delete-store-data" title="1. Delete your store data">
        <P>
          Uninstall SEO Rating from your Shopify admin (Settings → Apps → SEO Rating → Delete).
          Shopify notifies us, and your store&rsquo;s data — products we&rsquo;ve touched, generated
          content, usage history, and any connected integrations — is fully deleted from our
          database on Shopify&rsquo;s own redaction schedule, typically within about 48 hours of
          uninstall.
        </P>
        <P>
          If you want your data deleted sooner than that, or want confirmation once it&rsquo;s done,
          email <a href="mailto:apps@thenextsprout.com">apps@thenextsprout.com</a> and we&rsquo;ll
          handle it directly.
        </P>
      </LegalSection>

      <LegalSection id="revoke-google" title="2. Revoke Google access">
        <P>
          If you connected Google Search Console, open <strong style={{ fontWeight: 600 }}>Search
          Appearance</strong> inside the app and disconnect it from there — this permanently deletes
          the stored connection and encrypted tokens, not just the app&rsquo;s access to it.
        </P>
        <P>
          You can also revoke access directly from your Google Account at{" "}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
            myaccount.google.com/permissions
          </a>
          , which stops the connection from Google&rsquo;s side immediately. We recommend
          disconnecting from inside the app as well, so our stored copy of the (now-invalid) tokens
          is cleaned up too — though our code also deletes them automatically the next time it
          detects Google has revoked them.
        </P>
      </LegalSection>

      <LegalSection id="what-happens" title="3. What happens to your data">
        <P>
          Uninstalling removes your active session immediately. Full deletion of your store record —
          and everything tied to it, including any connected Google account — follows automatically
          when Shopify sends us the mandatory shop-redaction webhook, on Shopify&rsquo;s own schedule
          (typically within about 48 hours). Between those two points, your store is marked
          uninstalled but not yet purged.
        </P>
      </LegalSection>

      <LegalSection id="customer-requests" title="4. Requests from your customers">
        <P>
          SEO Rating works on your store&rsquo;s catalogue and content, not on your shoppers&rsquo;
          personal data — it doesn&rsquo;t read or store customer or order records. If one of your
          customers asks you about data held by apps on your store, there is nothing of theirs held
          by SEO Rating to locate or delete. We still acknowledge Shopify&rsquo;s mandatory{" "}
          <code className="inline-code">customers/data_request</code> and{" "}
          <code className="inline-code">customers/redact</code> webhooks for exactly this reason —
          see the <a href="/privacy">Privacy Policy</a> for detail.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
