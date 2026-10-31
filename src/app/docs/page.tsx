import Link from "next/link";
import { JsonLd, ORG_ID, breadcrumbs } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { CREDIT_COSTS, PLANS } from "@/lib/pricing";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Documentation",
  description:
    "A walkthrough of every TNS SEO & AI Visibility module as it works today: SEO tags, alt text, page optimization, structured data, Search Console, llms.txt, IndexNow, keyword research, PageSpeed audits and AI credits.",
  path: "/docs",
});

const TOC = [
  { id: "getting-started", label: "Getting started" },
  { id: "seo-tags", label: "SEO Tags" },
  { id: "page-optimization", label: "Page Optimization" },
  { id: "search-appearance", label: "Search Appearance" },
  { id: "url-management", label: "URL Management" },
  { id: "ai-visibility", label: "AI Visibility" },
  { id: "keyword-research", label: "Keyword Research" },
  { id: "store-performance", label: "Store Performance" },
  { id: "ai-credits", label: "AI Credits" },
];

const MODIFIED = "2026-10-24";

export default function Documentation() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: `How to use ${SITE_NAME}`,
            description: "A walkthrough of every module in the TNS SEO & AI Visibility Shopify app.",
            url: absoluteUrl("/docs"),
            dateModified: MODIFIED,
            author: { "@id": ORG_ID },
            publisher: { "@id": ORG_ID },
            about: { "@type": "SoftwareApplication", name: SITE_NAME },
          },
          breadcrumbs([{ name: "Docs", path: "/docs" }]),
        ]}
      />
      <div className="container container-narrow" style={{ padding: "64px 24px 96px" }}>
        <span className="eyebrow">Documentation</span>
        <h1 style={{ margin: "14px 0 0", maxWidth: 720, fontSize: "clamp(34px,5vw,44px)", lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 600 }}>
          How to use {SITE_NAME}
        </h1>
        <p className="lead" style={{ maxWidth: 640, fontSize: 17.5 }}>
          A walkthrough of every module in the app as it works today: what each one does, when to use it, and what it
          changes in your store. Nothing here is a roadmap item.
        </p>

        <nav aria-label="Documentation sections" style={{ marginTop: 52 }}>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 12 }}>
            {TOC.map((t, i) => {
              const hl = t.id === "ai-credits";
              return (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={`card${hl ? " card-soft" : ""}`} style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4, borderRadius: 12 }}>
                    <span className="mono" style={{ fontSize: 11, color: hl ? "var(--color-primary)" : "var(--color-text-faintest)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: hl ? "var(--color-primary-deep)" : "var(--color-text)" }}>{t.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="docs-prose" style={{ marginTop: 56, maxWidth: 760 }}>
          <section id="getting-started">
            <h2>Getting started</h2>
            <h3>Installing the app</h3>
            <p>
              Install {SITE_NAME} from the Shopify App Store. Shopify shows you the
              permissions the app needs before you approve. It reads and writes the SEO-related parts of your store:
              products, pages and blog articles, uploaded files, your theme (to find images missing alt text) and URL
              redirects. Approving the install opens the app inside your Shopify admin. There&rsquo;s no separate account
              or password to create.
            </p>
            <h3>What happens after install</h3>
            <p>
              Your catalog syncs automatically in the background: titles, descriptions, images, variants and
              collections. Nothing in your store changes. The sync just gives every tool the data it needs, and product
              creates, updates and deletes keep it current through Shopify webhooks, so there&rsquo;s no re-sync button to
              remember.
            </p>
            <p>
              There&rsquo;s no setup wizard. Every tool works from sensible defaults the moment you open it. Settings lets
              you set an <strong>AI brand name</strong> (the name AI-written copy credits, if it differs from your Shopify
              store name) and a default output language. Both are optional.
            </p>
            <div className="card" style={{ background: "var(--color-surface)", borderRadius: 12 }}>
              <p className="mono-label-muted" style={{ margin: "0 0 8px" }}>
                Suggested first session
              </p>
              <ol style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 7, fontSize: 15, lineHeight: 1.62 }}>
                <li>Run a Store Performance audit so you have a baseline.</li>
                <li>Fix missing meta tags and alt text, the highest-volume and lowest-risk wins.</li>
                <li>Turn on structured data and generate your llms.txt and agents.md files.</li>
                <li>Connect Google Search Console, then work through Page Optimization page by page.</li>
              </ol>
            </div>
          </section>

          <section id="seo-tags">
            <h2>SEO Tags</h2>
            <p>
              Two related tools for the text that decides how your pages are described in search results and to AI
              systems: meta tags and image alt tags.
            </p>
            <h3>Meta titles and descriptions</h3>
            <p>
              Edit the meta title and description of every product, collection, page, blog and article. There are three
              ways to fill them:
            </p>
            <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 9 }}>
              <li>
                <strong>Template.</strong> Build a pattern once with variables like <code className="inline-code">{"{Product title}"}</code>{" "}
                or <code className="inline-code">{"{Shop name}"}</code> and apply it across many items at once. Templates
                don&rsquo;t use AI credits.
              </li>
              <li>
                <strong>AI Generate.</strong> Write unique tags for each item from its actual content. Drafts appear next to
                the current value so you can compare before saving.
              </li>
              <li>
                <strong>Import.</strong> Upload a CSV of tags you already wrote elsewhere and apply them in bulk.
              </li>
            </ul>
            <p>
              Applying a template can fill only empty fields or overwrite existing ones; you choose. Either way, every save
              creates a checkpoint, and <strong>Restore previous</strong> writes the old values straight back to Shopify.
            </p>
            <h3>Image alt tags</h3>
            <p>
              The app finds images with missing or empty alt text and writes descriptions of what&rsquo;s actually in each
              image. It looks at the picture, not just the filename. It covers product, collection and article images,
              standalone uploads in your Files library, and images used in your theme such as banners and section images.
              Review and edit the results in a list, then save; alt text is written back to Shopify.
            </p>
            <p>
              Alt text helps accessibility first and search second. Screen readers read exactly what you save, so review
              anything that describes people, claims or context.
            </p>
          </section>

          <section id="page-optimization">
            <h2>Page Optimization</h2>
            <p>
              A real on-page audit for products, collections, articles, blogs, other pages and your home page. Each page
              gets an <strong>SEO Health</strong> checklist across four categories (Basic SEO, Additional checks, Title
              readability and Content readability), covering keyword presence and position, content length, URL length,
              internal and outbound links, image usage and paragraph length. Each check says what&rsquo;s wrong and why it
              matters.
            </p>
            <p>
              The <strong>AI Optimizer</strong> takes a focus keyword and drafts a title, description, handle and tags for
              that page in one go. You can carry a keyword over from Keyword Research. If you change a URL handle, the app
              creates a redirect from the old URL automatically, so existing links keep working.
            </p>
            <div className="callout" style={{ borderRadius: "0 10px 10px 0", borderLeft: "3px solid var(--color-primary)" }}>
              <strong>Review before publish.</strong> Nothing the optimizer writes goes live on its own. You see the proposed
              change beside the current content, edit it freely, then publish or discard. This applies to every AI-assisted
              write in the app, and every save creates a restorable checkpoint.
            </div>
          </section>

          <section id="search-appearance">
            <h2>Search Appearance</h2>
            <p>Everything that controls how your store is represented to search engines at a technical level.</p>
            <h3>Structured data (JSON-LD)</h3>
            <p>
              Seven schema types, each a toggle: <strong>Product</strong> and <strong>Breadcrumb</strong> on product pages,{" "}
              <strong>Collection</strong> on collection pages, <strong>Article</strong> and <strong>Blog</strong> on your blog,
              and <strong>Site search box</strong> and <strong>Organization</strong> on your home page. They&rsquo;re added
              through the app&rsquo;s theme app embed, which you switch on once in the theme editor. Google stopped
              showing the sitelinks search box in its results in late 2024, so that toggle is harmless but no longer
              changes how you appear in Google. Then use{" "}
              <em>Run test</em> to confirm the markup appears on your live store.
            </p>
            <h3>Local Business</h3>
            <p>
              If you have a physical location, enter your business name, address, phone and opening hours, and the app
              publishes Local Business structured data for it. Useful where local intent matters, and for making your
              business details unambiguous to AI assistants.
            </p>
            <h3>Google Search Console</h3>
            <p>
              Connect your Google account to see real Search Console data in the app: clicks, impressions, average
              position, and your top queries and pages. If your store isn&rsquo;t verified in Search Console yet, the app
              can verify the domain for you. With the same connection you can <strong>resubmit your sitemap to
              Google</strong> and <strong>inspect a URL&rsquo;s index status in Google</strong>: whether it&rsquo;s indexed,
              when Google last crawled it, and why not if it isn&rsquo;t. Google decides when and whether to crawl and
              index a page; neither action forces that. Disconnecting Google deletes the stored tokens.
            </p>
            <h3>Robots.txt</h3>
            <p>
              See your live robots.txt rules, add or remove rules per crawler (including AI crawlers), or switch to a raw
              text editor. This is the one area where a mistake can hide your store from search, so read the effective file
              carefully before you save.
            </p>
          </section>

          <section id="url-management">
            <h2>URL Management</h2>
            <h3>HTML sitemap</h3>
            <p>
              Your Shopify <code className="inline-code">sitemap.xml</code> stays untouched and is still what you submit to
              Search Console. The app adds a separate, human-readable HTML sitemap page (for example, linked from your
              footer) that lists your products, collections, pages, blogs and articles for visitors and crawlers.
            </p>
            <h3>Broken links</h3>
            <p>
              The app scans products, collections, pages, blogs and articles for links that no longer resolve, such as
              deleted products, mistyped URLs or dead external pages. Turn on <strong>Auto fix</strong> and internal broken
              links get a real redirect to the destination you choose. External links can only be reported, since you
              can&rsquo;t redirect a page you don&rsquo;t control.
            </p>
          </section>

          <section id="ai-visibility">
            <h2>AI Visibility</h2>
            <p>
              People now ask ChatGPT, Perplexity and Gemini what to buy. These tools make your store easy for those systems
              to read and reference correctly. No tool can guarantee an assistant will cite you; what you control is whether
              your store is easy to understand.
            </p>
            <h3>llms.txt and agents.md</h3>
            <p>
              The app generates both files from your real store data and serves them on your domain.{" "}
              <code className="inline-code">llms.txt</code> is a clean summary of what your store is and sells, in a form
              language models can read without wading through theme markup. <code className="inline-code">agents.md</code>{" "}
              describes your store for AI agents, including key pages and policies. You review and can edit both before
              publishing. Read more in{" "}
              <Link href="/blog/what-is-llms-txt-shopify">What is llms.txt, and does your Shopify store need one?</Link>
            </p>
            <h3>IndexNow</h3>
            <p>
              IndexNow tells participating search engines the moment a URL changes instead of waiting for a recrawl.
              Submitting through Bing relays to the other participating engines, such as Yandex, Seznam and Naver. Google
              doesn&rsquo;t take part in IndexNow; for Google, resubmit your sitemap from the Search Console section.
            </p>
            <h3>Outreach tracker</h3>
            <p>
              A simple tracker for your own outreach to the AI publishers, directories and data sources you&rsquo;d like to be
              listed or cited by. Add entries, then track status and notes. It keeps you organized; it doesn&rsquo;t send
              anything for you.
            </p>
          </section>

          <section id="keyword-research">
            <h2>Keyword Research</h2>
            <p>
              Enter a seed keyword and get real search volume, competition, trend and search intent, plus related keyword
              suggestions, from a dedicated keyword data provider. Save the keywords you want to target, and use{" "}
              <strong>Link to page</strong> to carry one into Page Optimization as that page&rsquo;s focus keyword.
            </p>
            <p>
              <strong>Generate topics</strong> turns a keyword into six article ideas, each with a content angle like
              &ldquo;Buying guide&rdquo; or &ldquo;Comparison&rdquo;. Pick one and the <strong>Article generator</strong> writes a
              full draft (title, body and tags) that you review, edit and publish into the Shopify blog you choose.
            </p>
          </section>

          <section id="store-performance">
            <h2>Store Performance</h2>
            <p>
              Run a real Google PageSpeed Insights audit for four page slots you choose: your home page, a product, a
              collection and a blog post. You get mobile and desktop Performance, Accessibility, Best practices and SEO
              scores, plus Core Web Vitals (LCP, INP, CLS). Field data from real visitors appears when Google has enough of
              it.
            </p>
            <p>
              Testing is limited to 12 slot tests a day on every plan, because all shops share one Google quota. Speed
              fixes usually live in your theme or apps, so treat this as a diagnostic: take a baseline, re-test after theme
              or app changes, and hand the findings to whoever maintains your theme.
            </p>
          </section>

          <section id="ai-credits" className="card card-soft" style={{ borderRadius: 16, padding: "clamp(22px,3vw,32px)" }}>
            <h2 style={{ color: "var(--color-primary-deep)" }}>AI Credits</h2>
            <p style={{ color: "var(--color-primary-deep-soft)" }}>
              AI costs real money to run, so instead of hiding it behind a vague fair-use policy, the app meters it.
              Anything that calls a model uses credits. Audits, templates, structured data, robots.txt, sitemaps,
              broken-link checks, IndexNow and PageSpeed tests don&rsquo;t.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["You see the cost before you run it", "Each AI action shows its credit cost up front, and bulk actions show the total before you confirm."],
                ["Your balance is always visible", "The app shows how many credits you have left this month, so usage is never a surprise."],
                [
                  "Included with your plan",
                  `Monthly allowances: ${PLANS.map((p) => `${p.name} ${p.credits.toLocaleString("en-US")}`).join(", ")}. Allowances reset each billing cycle and unused credits don’t roll over.`,
                ],
              ].map(([t, b]) => (
                <div key={t} style={{ background: "#fff", border: "1px solid var(--color-primary-soft-border)", borderRadius: 12, padding: "18px 20px" }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 16.5, color: "var(--color-primary-deep)" }}>{t}</h3>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--color-primary-deep-soft)" }}>{b}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid var(--color-primary-soft-border)", borderRadius: 12, overflow: "hidden" }}>
              <table className="credit-table">
                <caption className="sr-only">Credit cost per AI action</caption>
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
            </div>
            <p style={{ color: "var(--color-primary-deep-soft)" }}>
              A practical habit: use templates for routine, high-volume work where a pattern reads well, and spend credits
              where judgement actually helps, like your top products, collection pages and content you want AI assistants to
              understand properly.
            </p>
          </section>

          <section style={{ borderTop: "1px solid var(--color-border)", paddingTop: 32, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, maxWidth: 440, color: "var(--color-text-soft)" }}>
              Something unclear, or a step that doesn&rsquo;t match what you see in the app? Tell us and we&rsquo;ll fix the docs.
            </p>
            <Link href="/contact" className="btn btn-secondary" style={{ height: 44, fontSize: 15, marginTop: 0 }}>
              Contact support
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
