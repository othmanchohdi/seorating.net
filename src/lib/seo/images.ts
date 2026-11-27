import { attr, decode, withoutScripts } from "@/lib/ai-check/html";
import { mapLimit } from "@/lib/ai-check/net";
import { probeImage, type ImageInfo } from "./image-meta";
import { formatBytes } from "./format";
import type { Finding, Tone } from "./types";

// Image weight audit: every <img> on a page, with its real file size,
// format and pixel size, plus the markup mistakes that hurt LCP and CLS.

type ImgTag = { src: string; alt: string | null; hasDims: boolean; lazy: boolean; srcset: boolean; position: number };

export function imageTags(html: string, base: string, max = 40): ImgTag[] {
  const seen = new Set<string>();
  const out: ImgTag[] = [];
  let position = 0;
  for (const tag of withoutScripts(html).match(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi) ?? []) {
    if (attr(tag, "width") === "1" || attr(tag, "height") === "1") continue;
    const raw = attr(tag, "src") ?? attr(tag, "data-src") ?? attr(tag, "srcset")?.split(/\s+/)[0] ?? attr(tag, "data-srcset")?.split(/\s+/)[0];
    if (!raw || raw.startsWith("data:")) continue;
    let src: string;
    try {
      src = new URL(decode(raw), base).toString();
    } catch {
      continue;
    }
    position++;
    if (seen.has(src)) continue;
    seen.add(src);
    out.push({
      src,
      alt: attr(tag, "alt"),
      hasDims: !!(attr(tag, "width") && attr(tag, "height")) || /aspect-ratio/i.test(attr(tag, "style") ?? ""),
      lazy: /lazy/i.test(attr(tag, "loading") ?? "") || /\blazy(load)?\b/i.test(attr(tag, "class") ?? ""),
      srcset: !!(attr(tag, "srcset") || attr(tag, "data-srcset")),
      position,
    });
    if (out.length >= max) break;
  }
  return out;
}

export type ImageResult = ImgTag & ImageInfo & { tone: Tone; issues: string[] };

const KB = 1024;

function judge(tag: ImgTag, info: ImageInfo): ImageResult {
  const issues: string[] = [];
  let tone: Tone = "ok";
  const flag = (t: Tone, text: string) => {
    issues.push(text);
    if (t === "bad" || (t === "warn" && tone === "ok")) tone = t;
  };
  if (info.status !== 200) flag("bad", info.status ? `Returns HTTP ${info.status}.` : "Couldn't load this image.");
  if (info.bytes !== null && info.bytes > 500 * KB) flag("bad", "Over 500 KB. Compress it or upload at the size it's shown.");
  else if (info.bytes !== null && info.bytes > 200 * KB) flag("warn", "Over 200 KB. Worth compressing.");
  if (info.format === "png" && (info.bytes ?? 0) > 100 * KB) flag("warn", "A large PNG. Photos are far smaller as WebP or AVIF (or JPEG).");
  else if ((info.format === "jpeg" || info.format === "gif") && (info.bytes ?? 0) > 100 * KB) flag("warn", `Served as ${info.format.toUpperCase()}. WebP or AVIF is usually 25–50% smaller.`);
  if (info.width && info.width > 2560) flag("warn", `${info.width}px wide. Few screens show more than 2,000px; resize before uploading.`);
  if (!tag.srcset && info.width && info.width > 1000) flag("warn", "No srcset, so phones download the full desktop size.");
  if (!tag.hasDims) flag("warn", "No width and height, so the page can jump as it loads (CLS).");
  if (tag.lazy && tag.position <= 2) flag("warn", "Lazy-loaded but near the top of the page, which delays your main image (LCP).");
  return { ...tag, ...info, src: tag.src, tone, issues };
}

export async function analyzeImages(html: string, base: string) {
  const tags = imageTags(html, base);
  const infos = await mapLimit(tags, 8, (t) => probeImage(t.src));
  const images = tags.map((t, i) => judge(t, infos[i]));
  const known = images.filter((i) => i.bytes !== null);
  const totalBytes = known.reduce((s, i) => s + (i.bytes ?? 0), 0);
  const heavy = images.filter((i) => (i.bytes ?? 0) > 200 * KB).length;
  const noDims = images.filter((i) => !i.hasDims).length;
  const lazyTop = images.filter((i) => i.lazy && i.position <= 2).length;
  const oldFormat = images.filter((i) => (i.format === "jpeg" || i.format === "png" || i.format === "gif") && (i.bytes ?? 0) > 100 * KB).length;

  const findings: Finding[] = [];
  if (!images.length) {
    findings.push({ tone: "warn", text: "No images found in the page's HTML. They may be added by JavaScript." });
  } else {
    findings.push(
      totalBytes > 3 * KB * KB
        ? { tone: "bad", text: `${formatBytes(totalBytes)} of images across ${images.length} files. On mobile data that's slow; aim for under 1–2 MB on key pages.` }
        : totalBytes > 1.5 * KB * KB
          ? { tone: "warn", text: `${formatBytes(totalBytes)} of images across ${images.length} files. Compressing the heaviest few will help.` }
          : { tone: "ok", text: `${formatBytes(totalBytes)} of images across ${images.length} files.` },
      heavy ? { tone: heavy > 3 ? "bad" : "warn", text: `${heavy} image${heavy === 1 ? " is" : "s are"} over 200 KB.` } : { tone: "ok", text: "No image is over 200 KB." },
      oldFormat ? { tone: "warn", text: `${oldFormat} large image${oldFormat === 1 ? " is" : "s are"} JPEG, PNG or GIF rather than WebP or AVIF.` } : { tone: "ok", text: "Large images use modern formats." },
      noDims ? { tone: "warn", text: `${noDims} image${noDims === 1 ? " has" : "s have"} no width and height, a common cause of layout shift.` } : { tone: "ok", text: "Every image has width and height set." },
    );
    if (lazyTop) findings.push({ tone: "warn", text: "An image at the top of the page is lazy-loaded, which slows Largest Contentful Paint." });
  }
  return { images: images.sort((a, b) => (b.bytes ?? 0) - (a.bytes ?? 0)), totalBytes, measured: known.length, findings, capped: tags.length >= 40 };
}
