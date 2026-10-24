import { POSTS, formatDate, getPost } from "@/content/blog";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "SEO Rating blog article";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return ogImage({
    eyebrow: post ? `Blog · ${post.category}` : "Blog",
    title: post?.title ?? "SEO Rating blog",
    footer: post ? `seorating.net/blog · ${formatDate(post.published, "long")}` : "seorating.net/blog",
  });
}
