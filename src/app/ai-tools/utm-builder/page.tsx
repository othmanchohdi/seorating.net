import Link from "next/link";
import { SlugBuilder, UtmBuilder } from "@/components/tools/UtmBuilder";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/utm-builder";

export const metadata = pageMetadata({
  title: "UTM Builder & URL Slug Generator (Free)",
  description: "Build UTM-tagged campaign links for email, social and ads with presets and consistency checks, and turn any title into a clean, short URL slug for Shopify. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "What are UTM parameters?",
    a: 'Tags added to the end of a link (utm_source, utm_medium, utm_campaign and optionally utm_term and utm_content) that tell Google Analytics and Shopify where a visit came from. Without them, clicks from emails and Instagram bios often show up as "direct".',
  },
  {
    q: "Should I use UTMs on internal links?",
    a: "No. Only tag links on other sites: emails, social posts, ads, influencer links. Tagging links inside your own store starts a new session in analytics and wipes out the real source.",
  },
  {
    q: "Does changing a Shopify URL handle hurt SEO?",
    a: 'Not if you redirect the old URL. When you edit a handle, Shopify offers a "Create a URL redirect" checkbox; leave it ticked so old links and rankings carry over.',
  },
];

export default function UtmBuilderPage() {
  return (
    <ToolPage
      path={PATH}
      name="UTM link & slug builder"
      title="UTM link & slug builder"
      lead="Build consistent UTM-tagged links for your campaigns so analytics shows exactly where sales come from, and turn any title into a short, clean URL handle."
      faqs={FAQS}
      widget={
        <>
          <UtmBuilder />
          <SlugBuilder />
        </>
      }
      guide={
        <>
          <section>
            <h2>A naming convention saves your reports</h2>
            <ul>
              <li>
                <strong>Lowercase everything.</strong> UTM values are case-sensitive.
              </li>
              <li>
                <strong>Use hyphens, not spaces.</strong>
              </li>
              <li>
                <strong>Keep a fixed list of sources and mediums</strong> (email, social, paid-social, cpc, referral) and reuse it.
              </li>
              <li>
                <strong>Name campaigns so they sort</strong>: 2026-11-black-friday rather than bf.
              </li>
            </ul>
            <h2>Good slugs</h2>
            <ul>
              <li>
                Short and descriptive: <code>/products/relaxed-linen-shirt</code>.
              </li>
              <li>No dates, stock codes or filler words you&rsquo;ll want to change later.</li>
            </ul>
            <p>
              Check that your old URLs redirect after changing a handle with the <Link href="/ai-tools/redirect-checker">redirect checker</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
