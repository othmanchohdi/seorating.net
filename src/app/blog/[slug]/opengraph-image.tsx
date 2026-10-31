import { POSTS, formatDate, getPost } from "@/content/blog";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "TNS SEO & AI Visibility blog article";
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
    title: post?.title ?? "TNS SEO & AI Visibility blog",
    footer: post ? `seorating.net/blog · ${formatDate(post.published, "long")}` : "seorating.net/blog",
  });
}
