import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { LEGAL_UPDATED, SUPPORT_EMAIL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Support",
  description: "How to get help with the SEO Rating Shopify app: email support, response times, the in-app help center and common questions.",
  path: "/support",
});

const SECTIONS = [
  { id: "how-to-get-help", label: "1. How to get help" },
  { id: "response-time", label: "2. Response time" },
  { id: "in-app-help", label: "3. In-app help center" },
  { id: "faq", label: "4. FAQ" },
];

const FAQS = [
  {
    q: "How do I disconnect Google Search Console?",
    a: "Open Search Appearance inside the app and disconnect from there. This permanently deletes the stored Google connection — it doesn't just hide it.",
  },
  {
    q: "What happens to my data when I uninstall the app?",
    a: "Your active session is removed immediately. Shopify then sends us a shop-redaction request on its own schedule, typically within about 48 hours, at which point your store's data is fully deleted from our database.",
  },
  {
    q: "Do unused AI credits roll over to the next month?",
    a: "No. Each plan's monthly credit allowance resets at the start of the next cycle; unused credits don't carry forward.",
  },
  {
    q: "Is there a free trial on paid plans?",
    a: "No — Growth, Pro and Scale start billing from the day you subscribe. The Free plan has no time limit, so you can use it indefinitely at its usage limits before upgrading.",
  },
  {
    q: "Does AI-generated content publish automatically?",
    a: "No. Every AI-assisted feature shows you a draft next to the current content and waits for you to approve it before anything changes in your store.",
  },
];

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>{children}</p>;
}

export default function Support() {
  return (
    <LegalLayout
      eyebrow="Support"
      title="Support"
      lastUpdated={LEGAL_UPDATED}
      sections={SECTIONS}
    >
      <LegalSection id="how-to-get-help" title="1. How to get help">
        <P>
          Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with support
          questions, billing questions, feature requests, or a problem with the app, or use the{" "}
          <Link href="/contact">contact form</Link>. A human from the team replies to every message.
        </P>
      </LegalSection>

      <LegalSection id="response-time" title="2. Response time">
        <P>
          We reply to every message within 1 business day. Support runs in shifts from
          Chicago and Monastir, so most messages get an answer much sooner. Data deletion and billing
          requests follow the same timeline.
        </P>
      </LegalSection>

      <LegalSection id="in-app-help" title="3. In-app help center">
        <P>
          Once the app is installed, open the Help Center from inside Shopify admin for a searchable
          FAQ covering every feature. This website&rsquo;s <Link href="/docs">Documentation</Link>{" "}
          page covers the same ground for anyone evaluating the app before installing.
        </P>
      </LegalSection>

      <LegalSection id="faq" title="4. FAQ">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FAQS.map((item) => (
            <div key={item.q} className="card">
              <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>{item.q}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-text-softer)" }}>{item.a}</p>
            </div>
          ))}
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
