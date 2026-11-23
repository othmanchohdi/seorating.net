import Link from "next/link";
import type { Post } from "./types";
import { AppCta, CodeBlock, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Most backlink advice is written for SaaS companies and media sites with a PR budget and a team to run it. A small
        Shopify brand has neither. That&rsquo;s fine &mdash; it just means the tactics that work are smaller, slower and
        more personal. Five that actually fit a small catalogue and a small team, roughly in order of effort.
      </p>

      <h2 id="why">Why backlinks still matter, briefly</h2>
      <p>
        Links are less of a blunt-force ranking lever than they were a decade ago; content and relevance carry more of the
        weight now. But for a competitive query, a relevant link from a site Google already trusts is still a
        differentiator most small stores don&rsquo;t have. The failure mode isn&rsquo;t having too few links &mdash;
        it&rsquo;s chasing volume from sources that add nothing. A single link from a supplier&rsquo;s stockist page is
        worth more than fifty from directories built to sell links.
      </p>

      <h2 id="t1">1. Suppliers, manufacturers and stockists</h2>
      <p>
        If you carry a named fabric, ingredient, component or brand, check whether the maker has a &ldquo;where to
        buy&rdquo; or stockists page. Most do, most already expect requests like this, and it&rsquo;s usually a short
        form rather than a pitch. This is the lowest-effort, highest-relevance link available to most product-based
        stores, and it&rsquo;s the one people skip because it doesn&rsquo;t feel like &ldquo;link building.&rdquo;
      </p>

      <h2 id="t2">2. Local and niche directories that actually matter</h2>
      <p>
        Not the &ldquo;submit your store to 50 directories&rdquo; services &mdash; those links sit on pages built only to
        hold links, carry no real audience, and are a waste of time at best. The directories worth a listing are specific:
        a regional chamber of commerce or business association if you have a real location, a buying guide written by a
        publication in your niche, or a Shopify ecosystem partner page if you use their app or theme.
      </p>
      <Note label="Skip these">
        Paid directory packages, link exchanges (&ldquo;link to us and we&rsquo;ll link to you&rdquo;), and guest-post
        networks that exist only to place links. They risk more than they return, and Google&rsquo;s spam policies treat
        obvious link schemes as a reason to take action, not just ignore the links.
      </Note>

      <h2 id="t3">3. Founder and expert quotes</h2>
      <p>
        Journalists and bloggers covering your niche regularly need a quote from someone who actually makes or sells the
        thing they&rsquo;re writing about. Responding to a request with a specific, useful answer &mdash; not a pitch for
        your store &mdash; earns a mention and usually a link, because you&rsquo;re the source, not an advertiser. Niche
        communities, forums and the comment sections of trade publications are where these requests surface for a small
        brand; you don&rsquo;t need a PR agency to find them, just to show up consistently.
      </p>

      <h2 id="t4">4. Links you&rsquo;ve already half-earned</h2>
      <p>
        Before chasing anything new, collect what you&rsquo;re owed. Wholesale partners, stockists and suppliers you work
        with may already mention your name without linking to you. A quick search finds unlinked mentions:
      </p>
      <CodeBlock file="search operator">{`"your brand name" -site:yourstore.com`}</CodeBlock>
      <p>
        A short, specific message asking them to turn the mention into a link usually works better than a cold pitch,
        because the relationship already exists.
      </p>

      <h2 id="t5">5. Something worth linking to, on its own merit</h2>
      <p>
        A free size guide, calculator or a short piece built from data only you have &mdash; your own sales trends, a
        survey of your customers &mdash; gives other sites a reason to link to you without being asked. It&rsquo;s the
        highest-effort tactic on this list and the one with the most upside, and it deserves a deeper look of its own,
        which we&rsquo;ll cover in a dedicated post on digital PR for ecommerce.
      </p>

      <h2 id="measure">Keeping track, realistically</h2>
      <p>
        You don&rsquo;t need daily monitoring. A simple list of who you&rsquo;ve reached out to, what you asked for, and
        whether they replied is enough to stop you re-pitching the same stockist twice or losing track of a promising
        lead. Check Google Search Console&rsquo;s <strong>Links</strong> report every month or two to see new and lost
        referring domains &mdash; it won&rsquo;t show everything, but it&rsquo;s a free, direct read on what Google itself
        sees pointing at you.
      </p>
      <p>
        A healthy chunk of this is also just cleanup: broken links elsewhere on your own site cost you nothing to fix and
        compound the same way a good backlink does. See our{" "}
        <Link href="/blog/shopify-internal-linking-guide">guide to internal linking</Link> for the half of the equation
        you fully control.
      </p>

      <AppCta
        title="Keep outreach organized instead of in your head"
        body="SEO Rating's outreach tracker lets you log every stockist, directory and publication you're chasing a link from, with status and notes, so nothing falls through."
      />
    </>
  );
}

export const post: Post = {
  slug: "backlinks-for-small-shopify-brands",
  title: "Backlinks for small Shopify brands: 5 realistic tactics",
  description:
    "Five link-building tactics sized for a small catalogue and a small team, in rough order of effort: stockist pages, real directories, expert quotes, half-earned mentions, and content worth linking to.",
  category: "Backlinks",
  tags: ["Backlinks", "Link building", "Shopify SEO"],
  published: "2026-11-30",
  readMinutes: 7,
  cover: {
    file: "backlinks.log",
    lines: ['stockist.com     → found', 'chamber.org      → requested', '"brand" mention  → unlinked', 'journalist quote → pending'],
  },
  toc: [
    { id: "why", label: "Why backlinks still matter" },
    { id: "t1", label: "1. Suppliers and stockists" },
    { id: "t2", label: "2. Directories that matter" },
    { id: "t3", label: "3. Founder and expert quotes" },
    { id: "t4", label: "4. Links you've half-earned" },
    { id: "t5", label: "5. Something worth linking to" },
    { id: "measure", label: "Keeping track" },
  ],
  Body,
};
