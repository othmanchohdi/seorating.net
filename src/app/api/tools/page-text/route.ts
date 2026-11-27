import { NextRequest, NextResponse } from "next/server";
import { metaContent, titleTag, visibleText } from "@/lib/ai-check/html";
import { extractHeadings } from "@/lib/seo/headings";
import { fetchPage } from "@/lib/seo/route";

// Keyword density checker: the readable text of a page (its <main> when it
// has one) plus the places a keyword matters most. Counting happens in the browser.

// Interface text that isn't content: buttons ("Open media in modal"),
// variant pickers, forms, navigation and screen-reader-only labels.
const CHROME = /<(button|select|form|nav|footer|dialog|variant-[a-z-]+|product-form|quantity-input|modal-dialog|product-modal)\b[\s\S]*?<\/\1>/gi;
const HIDDEN = /<(span|label|p|div|legend)\b[^>]*class=["'][^"']*\b(visually-hidden|sr-only|screen-reader-text|hidden)\b[^"']*["'][^>]*>[^<]*<\/\1>/gi;
export async function GET(req: NextRequest) {
  const r = await fetchPage(req);
  if (r instanceof NextResponse) return r;
  const html = r.page.body;
  return NextResponse.json({
    url: r.page.finalUrl,
    title: titleTag(html),
    description: metaContent(html, "description") ?? "",
    h1: extractHeadings(html).filter((h) => h.level === 1).map((h) => h.text),
    // Find <main> before stripping, so a stray unclosed tag can't swallow it.
    text: visibleText((html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? html).replace(CHROME, " ").replace(HIDDEN, " ")).slice(0, 80_000),
  });
}
