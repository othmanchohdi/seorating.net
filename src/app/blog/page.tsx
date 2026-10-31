import Link from "next/link";
import { BlogGrid } from "@/components/BlogGrid";
import { PostCover } from "@/components/PostCover";
import { CATEGORIES, POSTS, formatDate } from "@/content/blog";
import { JsonLd, ORG_ID, breadcrumbs } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Shopify SEO & AI Search Blog",
  description:
    "Practical guides to Shopify SEO and AI search: llms.txt, robots.txt, meta descriptions, alt text, product schema and PageSpeed, from the team behind SEO Rating.",
  path: "/blog",
});

export default function Blog() {
  const [featured, ...rest] = POSTS;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": absoluteUrl("/blog#blog"),
            name: `${SITE_NAME} blog`,
            url: absoluteUrl("/blog"),
            publisher: { "@id": ORG_ID },
            blogPost: POSTS.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: absoluteUrl(`/blog/${p.slug}`),
              datePublished: p.published,
            })),
          },
          breadcrumbs([{ name: "Blog", path: "/blog" }]),
        ]}
      />

      <section className="container" style={{ padding: "clamp(48px,7vw,72px) 24px 32px" }}>
        <span className="eyebrow">Blog</span>
        <h1 style={{ margin: "14px 0 0", maxWidth: 760, fontSize: "clamp(36px,5.2vw,52px)", lineHeight: 1.04, letterSpacing: "-0.032em", fontWeight: 600 }}>
          Practical SEO for Shopify stores, and for AI search.
        </h1>
        <p className="lead" style={{ maxWidth: 600 }}>
          Guides and notes from the team behind {SITE_NAME}.
        </p>
      </section>

      <section className="container" style={{ padding: "8px 24px 40px" }}>
        <Link
          href={`/blog/${featured.slug}`}
          className="card"
          style={{ padding: 0, borderRadius: 20, overflow: "hidden", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))" }}
        >
          <div style={{ minHeight: 300 }}>
            <PostCover post={featured} size="lg" />
          </div>
          <article style={{ padding: "clamp(24px,4vw,40px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
              <span className="chip">Latest</span>
              <span className="mono" style={{ fontSize: 12, color: "var(--color-text-faintest)" }}>
                {featured.category} · {featured.readMinutes} min read
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: "clamp(26px,3.2vw,32px)", lineHeight: 1.14, letterSpacing: "-0.025em", fontWeight: 600 }}>{featured.title}</h2>
            <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.6, color: "var(--color-text-soft)" }}>{featured.description}</p>
            <span style={{ marginTop: 22, fontSize: 15, fontWeight: 600, color: "var(--color-primary)" }}>Read article →</span>
          </article>
        </Link>
      </section>

      <section aria-label="All articles" className="container" style={{ padding: "0 24px 96px" }}>
        <BlogGrid
          categories={CATEGORIES}
          posts={rest.map((p) => ({
            slug: p.slug,
            title: p.title,
            description: p.description,
            category: p.category,
            meta: `${formatDate(p.published)} · ${p.readMinutes} min`,
            cover: <PostCover post={p} size="sm" />,
          }))}
        />
      </section>
    </>
  );
}
