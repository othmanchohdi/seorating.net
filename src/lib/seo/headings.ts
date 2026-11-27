import { attr, decode, stripTags, titleTag, withoutScripts } from "@/lib/ai-check/html";
import type { Finding } from "./types";

export type Heading = { level: number; text: string; skipped: boolean };

// h1–h6 in document order, as a crawler reads the page (no JavaScript).
// `skipped` marks a heading that jumps more than one level deeper than the
// one before it, e.g. an h4 straight after an h2.
export function extractHeadings(html: string, max = 300): Heading[] {
  const out: Heading[] = [];
  let prev = 0;
  for (const m of withoutScripts(html).matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi)) {
    const level = Number(m[1]);
    // A logo image inside a heading counts by its alt text, as screen readers read it.
    const img = m[2].match(/<img\b[^>]*>/i)?.[0];
    const text = decode(stripTags(m[2])) || (img && attr(img, "alt") ? `[image] ${decode(attr(img, "alt")!)}` : "");
    out.push({ level, text: text.slice(0, 200), skipped: prev > 0 && level > prev + 1 });
    prev = level;
    if (out.length >= max) break;
  }
  return out;
}

export function headingFindings(headings: Heading[]): Finding[] {
  const h1s = headings.filter((h) => h.level === 1);
  const empty = headings.filter((h) => !h.text);
  const skips = headings.filter((h) => h.skipped);
  const out: Finding[] = [];

  if (!headings.length) return [{ tone: "bad", text: "No headings found in the page's HTML. If they're added by JavaScript, crawlers that don't run scripts won't see any structure." }];

  if (!h1s.length) out.push({ tone: "bad", text: "No H1. Every page should have one main heading that says what the page is about." });
  else if (h1s.length > 1) out.push({ tone: "warn", text: `${h1s.length} H1s. Google copes with several, but one clear H1 makes the page's topic unambiguous. Themes often wrap the logo in an H1 too.` });
  else if (!h1s[0].text) out.push({ tone: "bad", text: "The H1 is empty, so the page has no main heading crawlers can read. Often the theme wraps an image or icon in it." });
  else out.push({ tone: "ok", text: `One H1: “${h1s[0].text}”.` });

  const longH1 = h1s.find((h) => h.text.length > 70);
  if (longH1) out.push({ tone: "warn", text: `The H1 is ${longH1.text.length} characters. Keep it short and specific, under about 70.` });

  if (headings[0].level !== 1 && h1s.length) out.push({ tone: "warn", text: `The first heading is an H${headings[0].level}, before the H1. Usually that's a theme's announcement bar or menu using heading tags for styling.` });

  out.push(
    skips.length
      ? { tone: "warn", text: `${skips.length} skipped level${skips.length === 1 ? "" : "s"}, e.g. an H${skips[0].level} “${skips[0].text.slice(0, 50)}” with no H${skips[0].level - 1} above it. Screen reader users navigate by these levels.` }
      : { tone: "ok", text: "No skipped heading levels." },
  );
  out.push(
    empty.length
      ? { tone: "warn", text: `${empty.length} empty heading${empty.length === 1 ? "" : "s"}, often an icon or image inside a heading tag with no text or alt.` }
      : { tone: "ok", text: "Every heading has text." },
  );
  if (headings.length > 80) out.push({ tone: "warn", text: `${headings.length} headings. Menus and footers built from heading tags dilute the outline; use them for content structure only.` });
  return out;
}

export function analyzeHeadings(html: string) {
  const headings = extractHeadings(html);
  const counts = [1, 2, 3, 4, 5, 6].map((l) => headings.filter((h) => h.level === l).length);
  return { title: titleTag(html), headings, counts, findings: headingFindings(headings) };
}
