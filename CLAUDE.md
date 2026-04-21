# Big Bros Dumpster Rentals — Project Notes

Website for Big Bros Dumpster Rentals, a family-owned roll-off dumpster service in Fresno and Clovis, CA.

## Stack

- **Static HTML**, one file per route. No framework, no build step, no bundler.
- **Tailwind CSS v4** via CDN (`https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4`) — use utility classes directly in markup.
- **Vanilla JS** for interactivity: `js/main.js` (booking UI, modals), `js/i18n.js` (EN/ES toggle via `data-i18n` attributes).
- **Custom CSS tokens** in `css/styles.css` — `--orange: #FF5F00`, `--black: #0A0A0A`, plus `.glass`, `.mono`, `.focus-ring`, `.noise` utilities. Don't add new stylesheet files.
- **Deployed to Vercel** (see `vercel.json`). Clean URLs enabled — internal links can be written as `/fresno` or `fresno.html`.

## Page pattern

Every page is a standalone HTML file containing its own `<head>`, top dispatch bar, sticky nav header, `<main>`, footer, and sticky mobile CTA. There is no component system — when you change the nav or footer on one page, update all pages.

Current pages: `index.html`, `fresno.html`, `clovis.html`, `contractors.html`, `cleanouts.html`, six neighborhood pages (`tower-district.html`, `woodward-park.html`, `fig-garden.html`, `sunnyside.html`, `old-town-clovis.html`, `harlan-ranch.html`), and `404.html`.

When creating a new top-level page, use `contractors.html` as the template — it has the cleanest single-purpose landing structure.

## Brand voice

No-nonsense, trades-first, local. Short declarative sentences. "Talk direct to the bros, not a broker." Italic uppercase headlines are the house style. Don't soften it.

## The three differentiators

Every landing page (index, city pages, service pages) must surface these prominently — they're the real wedge against national competitors:

1. **Same-day delivery** when inventory is open (call/text before 2pm)
2. **True flat rate** — the quoted price covers mattresses, appliances, and furniture. No per-item surcharges. Competitors tack on fees for these; Big Bros does not.
3. **Licensed hauler with a Fresno County franchise agreement** — legally authorized to operate, unlike fly-by-night brokers.

There's a shared "trust band" component pattern (3-up grid after the hero) that carries these messages. Copy the markup from `index.html` when adding a new landing page.

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

- Don't install npm dependencies, don't introduce a build step, don't add a framework.
- Don't add new CSS files — extend `css/styles.css` or use Tailwind utilities.
- Don't add `aggregateRating` without real review data.
- Don't duplicate a city page for an unserved area. Current service area is Fresno + Clovis (plus surrounding Fresno County). Don't create pages for Sanger, Selma, Kerman, or Madera without confirmation.
- Don't remove the EN/ES language toggle or `data-i18n` attributes without updating `js/i18n.js`.
