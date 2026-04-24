# Big Bros Dumpster Rentals — Project Notes

Website for Big Bros Dumpster Rentals, a family-owned roll-off dumpster service in Fresno and Clovis, CA.

## Stack

- **Static HTML**, one file per route. No framework, no bundler.
- **Tailwind CSS v4** compiled locally via the Tailwind CLI. Source: `css/tailwind.src.css`. Output: `css/tailwind.css` (checked in, linked by every page). After editing HTML classes or `tailwind.src.css`, run `npm run build` (or `npm run watch` during development). The CDN runtime compiler is **not** used — it caused a zoomed-out flash on mobile.
- **Vanilla JS** for interactivity: `js/app.js` (booking UI, modals), `js/i18n.js` (EN/ES toggle via `data-i18n` attributes).
- **Custom CSS tokens** in `css/styles.css` — `--orange: #FF5F00`, `--black: #0A0A0A`, plus `.glass`, `.mono`, `.focus-ring`, `.noise` utilities. Don't add new stylesheet files.
- **Deployed to Vercel** (see `vercel.json`). Clean URLs enabled — internal links can be written as `/fresno` or `fresno.html`.

## Page pattern

Every page is a standalone HTML file containing its own `<head>`, top dispatch bar, sticky nav header, `<main>`, footer, and sticky mobile CTA. There is no component system — when you change the nav or footer on one page, update all pages.

Current pages: `index.html`, `fresno.html`, `clovis.html`, `contractors.html`, `cleanouts.html`, six neighborhood pages (`tower-district.html`, `woodward-park.html`, `fig-garden.html`, `sunnyside.html`, `old-town-clovis.html`, `harlan-ranch.html`), and `404.html`.

When creating a new top-level page, use `contractors.html` as the template — it has the cleanest single-purpose landing structure.

## Brand voice

No-nonsense, trades-first, local. Short declarative sentences. **The Big Bros are here to help — they work with people to make it work.** Italic uppercase headlines are the house style. Don't soften it. Avoid anti-competitor framing ("not a broker", "no call centers") — lead with what the Bros DO, not what others don't.

## Motto

**"We Drop Off, You Load Up."** This is the hero H1 on every landing page. Render in italic uppercase, with "YOU" in muted gray (`text-zinc-700`) for visual rhythm. The shared `data-i18n` keys are `hero.title1` ("We Drop Off"), `hero.title2` ("You", muted), `hero.title3` ("Load Up").

## The four differentiators

Every landing page must surface these prominently — they're the real wedge against national competitors. Use a 4-up trust band (`md:grid-cols-2 lg:grid-cols-4`) right after the hero.

1. **Same-day & next-day delivery** — biggest local fleet (20+ roll-offs, more than any other Fresno/Clovis hauler) means the Bros can almost always make it happen. Frame as capability, not a stat — say "biggest local fleet" rather than naming the number on the page.
2. **True flat rate** — the quoted price covers mattresses, appliances, tires, and furniture. No per-item surcharges. Competitors tack on $40+ per item.
3. **Keep it up to 7 days** — most rentals run a full week at the quoted rate. Need it longer? Talk to the Bros — they work with you.
4. **Here to help** — local family operation. Answer the phone, work with your schedule, make it right.

The Fresno County franchise / licensed-hauler line is still true and belongs in the FAQ and footer — but it's no longer one of the top differentiators on the hero or trust band.

## Competitor comparison section

Landing pages (especially `index.html`, `fresno.html`, `clovis.html`, `cleanouts.html`) include a "Compare The Other Guys" section. Show real surcharges competitors add: same-day fees ($50), per-day overages ($15–45/day after day 3), per-item fees for mattresses/appliances/tires ($40+ each). The point is that competitors' "low" starting price balloons fast. Footnote: "Surcharges based on advertised pricing from regional and national haulers."

## Cleanouts page

`cleanouts.html` leads with the "Big Bros are here to help" framing — this is the empathy-forward page for estate cleanouts, hoarder cleanups, post-tenant clears, and grief-adjacent jobs. Keep the motto in the hero, but in the supporting copy emphasize that the Bros work with the customer's pace and circumstances.

## SEO conventions

- Every page has three `application/ld+json` blocks: `LocalBusiness`, `FAQPage`, and `BreadcrumbList`. Keep them in sync when copying templates.
- Every page has full OG tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`).
- `canonical` link on every page.
- `makesOffer` in the LocalBusiness schema lists services — add a new Offer entry when a new service page ships (e.g., Residential Cleanout on `cleanouts.html`).
- **Do NOT add `aggregateRating`** to any JSON-LD until we have a real, verifiable review source wired up. Fabricated ratings violate Google's structured data policy.
- Update `sitemap.xml` by hand when adding a new page. The file is 60-ish lines — no generator.
- `robots.txt` is `Allow: /` + sitemap reference. Don't change.

## Assets

- Logo: `assets/logo.webp` (283x100, used in nav + footer)
- Hero image: `images/hero-dumpster.webp` (1024x1024)
- Roll-off product shot: `images/big-bros-rolloff.png` (used on size cards)
- Google favicon verification meta is on every page — keep it.

## Phone / contact

- Phone: `+1-559-495-8034` → display as `559‑495‑8034` (non-breaking hyphens `&#8209;` or `‑`)
- SMS body prefill pattern: `sms:+15594958034?&body=...` URL-encoded

## What NOT to do

- Don't add a framework or a bundler. The only build step is the Tailwind CLI (`npm run build`) — don't replace it with webpack/Vite/Parcel.
- Don't re-introduce the Tailwind Browser CDN script — always use the compiled `css/tailwind.css`.
- Don't add new CSS files — extend `css/styles.css` or use Tailwind utilities.
- Don't add `aggregateRating` without real review data.
- Don't duplicate a city page for an unserved area. Current service area is Fresno + Clovis (plus surrounding Fresno County). Don't create pages for Sanger, Selma, Kerman, or Madera without confirmation.
- Don't remove the EN/ES language toggle or `data-i18n` attributes without updating `js/i18n.js`.
