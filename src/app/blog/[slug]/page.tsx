import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCover } from "@/components/PostCover";
import { POSTS, formatDate, getPost, relatedPosts } from "@/content/blog";
import { JsonLd, ORG_ID, breadcrumbs } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.published,
    modifiedTime: post.updated ?? post.published,
    tags: post.tags,
  });
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}`);
  const { Body } = post;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            mainEntityOfPage: url,
            url,
            headline: post.title,
            description: post.description,
            image: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
            datePublished: post.published,
            dateModified: post.updated ?? post.published,
            articleSection: post.category,
            keywords: post.tags.join(", "),
            timeRequired: `PT${post.readMinutes}M`,
            inLanguage: "en",
            author: { "@type": "Organization", "@id": ORG_ID, name: "TheNextSprout team" },
            publisher: { "@id": ORG_ID },
            isPartOf: { "@id": absoluteUrl("/blog#blog") },
          },
          breadcrumbs([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article>
        <header className="container" style={{ maxWidth: 880, padding: "56px 24px 36px" }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: 13.5, color: "var(--color-text-faintest)", marginBottom: 28 }}>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <li>
                <Link href="/blog" style={{ color: "var(--color-text-softer)" }}>
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li style={{ color: "var(--color-primary)" }}>{post.category}</li>
            </ol>
          </nav>
          <h1 style={{ margin: 0, fontSize: "clamp(34px,5vw,50px)", lineHeight: 1.06, letterSpacing: "-0.032em", fontWeight: 600 }}>{post.title}</h1>
          <p className="lead" style={{ fontSize: 19, lineHeight: 1.55 }}>
            {post.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14, marginTop: 28 }}>
            <div
              aria-hidden="true"
              style={{ width: 40, height: 40, borderRadius: 999, background: "var(--color-primary-chip)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 15 }}
            >
              TN
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 14.5, fontWeight: 600 }}>TheNextSprout team</span>
              <span className="mono" style={{ fontSize: 12, color: "var(--color-text-faintest)" }}>
                <time dateTime={post.published}>{formatDate(post.published)}</time> · {post.readMinutes} min read
              </span>
            </div>
          </div>
        </header>

        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ aspectRatio: "21/9", minHeight: 220, borderRadius: 20, overflow: "hidden" }}>
            <PostCover post={post} size="lg" />
          </div>
        </div>

        <div className="container article-layout" style={{ maxWidth: 1100, padding: "56px 24px 72px" }}>
          <nav className="toc-aside" aria-label="On this page">
            <span className="mono-label-muted" style={{ marginBottom: 10 }}>
              On this page
            </span>
            {post.toc.map((t) => (
              <a key={t.id} href={`#${t.id}`}>
                {t.label}
              </a>
            ))}
          </nav>
          <div>
            <div className="prose">
              <Body />
            </div>
            <ul style={{ listStyle: "none", margin: "40px 0 0", padding: "24px 0 0", borderTop: "1px solid var(--color-border)", display: "flex", flexWrap: "wrap", gap: 8 }}>
              {post.tags.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-title" style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border-soft)" }}>
        <div className="container" style={{ padding: "72px 24px 88px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            <h2 id="related-title" style={{ margin: 0, fontSize: 28, letterSpacing: "-0.02em", fontWeight: 600 }}>
              Keep reading
            </h2>
            <Link href="/blog" style={{ fontSize: 15, fontWeight: 600 }}>
              All articles →
            </Link>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 24 }}>
            {relatedPosts(post).map((p) => (
              <li key={p.slug} style={{ display: "flex" }}>
                <Link href={`/blog/${p.slug}`} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", width: "100%" }}>
                  <div style={{ aspectRatio: "16/9" }}>
                    <PostCover post={p} size="sm" />
                  </div>
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                    <span className="mono" style={{ fontSize: 11.5, color: "var(--color-primary)" }}>
                      {p.category}
                    </span>
                    <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.3, fontWeight: 600 }}>{p.title}</h3>
                    <span className="mono" style={{ fontSize: 12, color: "var(--color-text-faintest)" }}>
                      {formatDate(p.published)} · {p.readMinutes} min
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
