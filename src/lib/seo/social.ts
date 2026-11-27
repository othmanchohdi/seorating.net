import { metaContent, titleTag } from "@/lib/ai-check/html";
import { probeImage, type ImageInfo } from "./image-meta";
import type { Finding } from "./types";

// Social share preview: the Open Graph and Twitter/X card tags a page
// gives link previews, plus the share image's real size.

export async function analyzeSocial(html: string, pageUrl: string) {
  const m = (k: string) => metaContent(html, k);
  const rawImage = m("og:image") ?? m("og:image:url") ?? m("og:image:secure_url") ?? m("twitter:image") ?? m("twitter:image:src");
  let image: string | null = null;
  try {
    image = rawImage ? new URL(rawImage, pageUrl).toString() : null;
  } catch {}

  const tags = {
    ogTitle: m("og:title"),
    ogDescription: m("og:description"),
    ogImage: m("og:image") ?? m("og:image:secure_url"),
    ogImageAlt: m("og:image:alt"),
    ogUrl: m("og:url"),
    ogType: m("og:type"),
    ogSiteName: m("og:site_name"),
    twitterCard: m("twitter:card"),
    twitterTitle: m("twitter:title"),
    twitterDescription: m("twitter:description"),
    twitterImage: m("twitter:image") ?? m("twitter:image:src"),
    twitterSite: m("twitter:site"),
  };
  const title = tags.ogTitle ?? tags.twitterTitle ?? titleTag(html);
  const description = tags.ogDescription ?? tags.twitterDescription ?? m("description") ?? "";
  const info: ImageInfo | null = image ? await probeImage(image) : null;

  const findings: Finding[] = [];
  findings.push(tags.ogTitle ? { tone: "ok", text: "og:title is set." } : { tone: "bad", text: "No og:title. Platforms fall back to the <title> tag or show nothing useful." });
  findings.push(tags.ogDescription ? { tone: "ok", text: "og:description is set." } : { tone: "warn", text: "No og:description. Some platforms show no text under the title without it." });
  if (!image) {
    findings.push({ tone: "bad", text: "No share image (og:image). Links without an image get far fewer clicks." });
  } else if (!info || info.status !== 200) {
    findings.push({ tone: "bad", text: `The share image ${info?.status ? `returns HTTP ${info.status}` : "couldn't be loaded"}, so platforms will show no image.` });
  } else {
    if (rawImage && !/^https?:\/\//i.test(rawImage)) findings.push({ tone: "warn", text: "og:image is a relative URL. Use a full https:// address; some platforms won't resolve it." });
    if (info.width && info.height) {
      const ratio = info.width / info.height;
      if (info.width < 600 || info.height < 315) findings.push({ tone: "warn", text: `The image is ${info.width}×${info.height}. Facebook and LinkedIn show small thumbnails below 600×315; aim for 1200×630.` });
      else if (Math.abs(ratio - 1.91) > 0.25) findings.push({ tone: "warn", text: `The image is ${info.width}×${info.height}, so platforms will crop it. 1200×630 (1.91:1) fits everywhere.` });
      else findings.push({ tone: "ok", text: `The image is ${info.width}×${info.height}, a good size for every platform.` });
    }
    if (info.bytes && info.bytes > 5 * 1024 * 1024) findings.push({ tone: "warn", text: "The image is over 5 MB, the limit on X. Compress it." });
    if (info.format === "avif" || info.format === "svg") findings.push({ tone: "warn", text: `The image is ${info.format.toUpperCase()}, which some platforms can't display. Use JPEG or PNG for share images.` });
  }
  findings.push(tags.twitterCard ? { tone: "ok", text: `twitter:card is “${tags.twitterCard}”.` } : { tone: "warn", text: "No twitter:card. X falls back to a small summary card; set “summary_large_image” for a full-width image." });
  if (title && title.length > 70) findings.push({ tone: "warn", text: `The title is ${title.length} characters and will be cut off on most platforms.` });

  return { url: pageUrl, title, description, image, imageInfo: info, siteName: tags.ogSiteName, tags, findings };
}
