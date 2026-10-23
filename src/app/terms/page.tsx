import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of the SEO Rating Shopify app.",
};

const SECTIONS = [
  { id: "the-service", label: "1. The service" },
  { id: "accounts", label: "2. Accounts and eligibility" },
  { id: "billing", label: "3. Plans, billing and AI credits" },
  { id: "acceptable-use", label: "4. Acceptable use" },
  { id: "ai-content", label: "5. AI content & no guarantee" },
  { id: "third-party", label: "6. Third-party services" },
  { id: "ip", label: "7. Intellectual property" },
  { id: "liability", label: "8. Limitation of liability" },
  { id: "termination", label: "9. Termination and cancellation" },
  { id: "changes", label: "10. Changes to these terms" },
  { id: "governing-law", label: "11. Governing law and disputes" },
  { id: "contact", label: "12. Contact" },
];

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>{children}</p>;
}

export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="[date placeholder — set when this is finalized and published]"
      sections={SECTIONS}
      draftNote="Plan names, prices and limits below are pulled directly from the app's live billing code. The entity name, governing law, and liability specifics still need a qualified lawyer's review before publishing. Bracketed items are placeholders."
    >
      <LegalSection id="the-service" title="1. The service">
        <P>
          SEO Rating (seorating.net), distributed on the Shopify App Store as &ldquo;TNS SEO &amp; AI
          Visibility&rdquo;, is a software application provided by TheNextSprout (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;). It is installed into a Shopify store by the merchant (&ldquo;you&rdquo;)
          and provides search-optimization and AI-visibility tooling, including AI-ready discovery
          file generation, robots.txt management, SEO tag and image alt tag generation, on-page
          audits and content optimization, structured data and search-appearance settings, keyword
          research, and store performance audits.
        </P>
        <P>
          By installing or using the app, you agree to these terms. Features may be added, changed
          or removed over time; where a change materially reduces functionality you rely on, we will
          make a reasonable effort to notify you.
        </P>
      </LegalSection>

      <LegalSection id="accounts" title="2. Accounts and eligibility">
        <P>
          Use of the app requires an active Shopify store and the permissions you grant during
          installation. You are responsible for the accuracy of the information in your account, for
          the actions taken by users you give access to, and for ensuring you have the right to
          publish the content the app writes to your store.
        </P>
      </LegalSection>

      <LegalSection id="billing" title="3. Plans, billing and AI credits">
        <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 10, fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
          <li>
            <strong style={{ fontWeight: 600 }}>Plans.</strong> Four plans are available: Free
            ($0/month), Growth ($29/month), Pro ($49/month) and Scale ($99/month), each billed
            monthly through Shopify&rsquo;s Billing API with no free trial period and no annual
            billing option. Each plan includes a fixed monthly AI credit allowance and keyword-search
            limits, stated in the app and on our pricing page, and may be adjusted with notice.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Upgrading, downgrading and price changes.</strong>{" "}
            Moving to a different plan is a new subscription request that Shopify asks you to
            approve. If we change a plan&rsquo;s price, that change applies to new subscribers and to
            existing subscribers only if and when they re-subscribe or change plans — Shopify does
            not let us silently re-bill an active subscription. If we change what a plan includes
            (credits or usage limits), that change can take effect immediately for everyone already
            on that plan, including partway through a billing cycle.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>AI credits.</strong> AI features consume credits.
            Your plan includes a monthly credit allowance; unused included credits do not roll over.
            Credit costs are shown in the app before an action is run. Pay-as-you-go credit top-ups
            are not currently offered.
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Refunds.</strong> Refund handling: [placeholder — to
            be finalized].
          </li>
          <li>
            <strong style={{ fontWeight: 600 }}>Taxes.</strong> Charges may be subject to taxes as
            determined by Shopify&rsquo;s billing arrangements and your jurisdiction.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="acceptable-use" title="4. Acceptable use">
        <P>You agree not to use the app to:</P>
        <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 8, fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
          <li>generate or publish content that is unlawful, infringing, deceptive, or misrepresents a product;</li>
          <li>publish deliberately misleading structured data or manipulate search and AI systems in ways that violate their published guidelines;</li>
          <li>attempt to circumvent usage limits, credit metering, rate limits, or billing;</li>
          <li>reverse engineer, resell, or provide the app as a service to third parties without written agreement;</li>
          <li>interfere with the app&rsquo;s infrastructure or the third-party services it depends on.</li>
        </ul>
        <P>We may suspend access where continued use presents a legal, security or platform-compliance risk.</P>
      </LegalSection>

      <LegalSection id="ai-content" title="5. AI-generated content and no performance guarantee">
        <div style={{ borderLeft: "3px solid var(--color-primary)", background: "#f7f6fe", padding: "16px 18px", borderRadius: "0 10px 10px 0", marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.68, color: "#2c2470" }}>
            <strong style={{ fontWeight: 600 }}>AI output is a starting point for your review, not
            guaranteed-accurate content.</strong> Meta tags, alt text, article ideas and content
            suggestions produced by the app may contain errors, omissions or claims that are
            inaccurate for your products. You are responsible for reviewing and approving anything
            before it is published to your store, and for its compliance with advertising, labelling
            and consumer law.
          </p>
        </div>
        <P>
          We do not guarantee any search ranking, traffic level, indexing outcome, or that your store
          will be cited or surfaced by any AI assistant. Search engines and AI systems control their
          own ranking and citation behaviour.
        </P>
      </LegalSection>

      <LegalSection id="third-party" title="6. Third-party services">
        <P>
          The app depends on Shopify (platform and billing), Anthropic (AI content generation),
          DataForSEO (keyword data), Google (Search Console and PageSpeed Insights, where you connect
          or request them), Bing IndexNow (URL submission, where enabled), and our own hosting and
          email infrastructure. Their availability, rate limits and terms are outside our control,
          and interruptions to them may affect app functionality. See the{" "}
          <a href="/privacy">Privacy Policy</a> for how data is shared with them.
        </P>
      </LegalSection>

      <LegalSection id="ip" title="7. Intellectual property">
        <P>
          We retain all rights in the app, its interface and its underlying software. Your store
          content remains yours, including content you approve and publish that was drafted with AI
          assistance. You grant us the limited rights needed to operate the app and process your data
          as described in the Privacy Policy.
        </P>
      </LegalSection>

      <LegalSection id="liability" title="8. Limitation of liability">
        <P>
          The app is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties
          of any kind to the extent permitted by law. We are not liable for indirect, incidental,
          special or consequential damages, or for lost revenue, lost traffic, lost rankings, lost
          data, or loss of goodwill.
        </P>
        <P>
          To the maximum extent permitted by law, our total aggregate liability arising out of or
          relating to the app is limited to the amounts you paid us for the app in the [12 months —
          placeholder] preceding the claim. Nothing in these terms excludes liability that cannot be
          excluded by law.
        </P>
      </LegalSection>

      <LegalSection id="termination" title="9. Termination and cancellation">
        <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 10, fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
          <li>You may cancel at any time by uninstalling the app from your Shopify admin. Uninstalling ends recurring charges in line with Shopify&rsquo;s billing behaviour; charges already incurred, including AI credit usage, remain payable.</li>
          <li>We may suspend or terminate access for breach of these terms, non-payment, or where required by Shopify or by law.</li>
          <li>On termination, data handling and deletion follow the retention and deletion section of the <a href="/privacy">Privacy Policy</a>, including Shopify&rsquo;s shop redaction process (your store record is deleted on Shopify&rsquo;s own schedule, typically within about 48 hours of uninstall).</li>
          <li>Settings the app wrote to your store (meta tags, alt text, structured data, robots.txt rules) remain in your store unless you change them.</li>
        </ul>
      </LegalSection>

      <LegalSection id="changes" title="10. Changes to these terms">
        <P>
          We may update these terms as the app changes. The &ldquo;last updated&rdquo; date above
          will change, and material changes will be communicated in the app or by email. Continued
          use after a change constitutes acceptance.
        </P>
      </LegalSection>

      <LegalSection id="governing-law" title="11. Governing law and disputes">
        <P>
          These terms are governed by the laws of [jurisdiction placeholder], and the courts of
          [venue placeholder] have exclusive jurisdiction over disputes. Dispute-resolution mechanism
          (informal resolution period, arbitration or courts): [placeholder — to be finalized with
          counsel].
        </P>
      </LegalSection>

      <LegalSection id="contact" title="12. Contact">
        <P>
          Questions about these terms:{" "}
          <a href="mailto:apps@thenextsprout.com">apps@thenextsprout.com</a>. Legal entity and
          registered address: [placeholder].
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
