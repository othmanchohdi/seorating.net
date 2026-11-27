import Link from "next/link";
import { SchemaGenerator } from "@/components/tools/SchemaGenerator";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/schema-generator";

export const metadata = pageMetadata({
  title: "FAQ & Organization Schema Generator (JSON-LD, Free)",
  description: "Build valid FAQPage and Organization JSON-LD for your store: questions and answers, logo, social profiles and contact details. Copy-paste ready, free, no signup.",
  path: PATH,
});

const FAQS = [
  {
    q: "Does FAQ schema still get rich results?",
    a: "Since August 2023 Google shows FAQ rich results only for well-known government and health websites. The markup is still worth adding on genuine FAQ pages: Bing and AI assistants read it, and it makes the questions and answers easy for machines to extract.",
  },
  {
    q: "Where do I put Organization schema?",
    a: "On your homepage only. It tells search engines your official name, logo, social profiles and contact details, which feed the knowledge panel and help AI assistants identify your brand.",
  },
  {
    q: "Many themes already add Organization schema. Should I add another?",
    a: "Check first with the structured data checker. If your theme already outputs an Organization block, edit that one rather than adding a second, conflicting copy.",
  },
];

export default function SchemaGeneratorPage() {
  return (
    <ToolPage
      path={PATH}
      name="FAQ & Organization schema generator"
      title="FAQ & Organization schema generator"
      lead="Build valid FAQPage and Organization JSON-LD for your store, ready to paste into your theme, with the rules for where each one belongs."
      faqs={FAQS}
      widget={<SchemaGenerator />}
      guide={
        <>
          <section>
            <h2>Adding it to a Shopify theme</h2>
            <ol>
              <li>
                In Online Store → Themes, choose Edit code and open <code>layout/theme.liquid</code>.
              </li>
              <li>
                Paste the script just before <code>&lt;/head&gt;</code>. Wrap Organization schema in <code>{"{% if template == 'index' %}"}</code> … <code>{"{% endif %}"}</code> so it only appears on
                the homepage.
              </li>
              <li>For an FAQ page, paste the FAQ script into that page&rsquo;s template instead, and make sure the same questions are visible on it.</li>
            </ol>
            <p>
              Then confirm it with the <Link href="/ai-tools/structured-data-checker">structured data checker</Link>. Need product markup? Use the{" "}
              <Link href="/ai-tools/product-schema-generator">product schema generator</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
