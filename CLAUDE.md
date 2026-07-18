# Big Bros Dumpster Rentals — Project Notes

Website for Big Bros Dumpster Rentals, a family-owned roll-off dumpster service in Fresno and Clovis, CA.

## Stack

- **Static HTML**, one file per route. No framework, no bundler.
- **Tailwind CSS v4** compiled locally via the Tailwind CLI. Source: `css/tailwind.src.css`. Output: `css/tailwind.css` (checked in, linked by every page). After editing HTML classes or `tailwind.src.css`, run `npm run build` (or `npm run watch` during development). The CDN runtime compiler is **not** used — it caused a zoomed-out flash on mobile.
- **Vanilla JS** for interactivity: `js/app.js` (booking UI, modals), `js/i18n.js` (EN/ES toggle via `data-i18n` attributes, persisted in localStorage).
- **Script order matters:** every page loads `js/i18n.js` then `js/app.js`, both with `defer`. app.js calls functions defined in i18n.js at init — reversing the order breaks all interactivity on the page.
- **Design tokens** live in two synced places: `css/tailwind.src.css` `@theme` (`--color-*`, generates utilities like `bg-card`, `text-stone`, `border-hairline`) and `css/styles.css` `:root` (plain aliases like `--orange` for JS/inline use). Change both together. Don't add new stylesheet files.
- **Deployed to Vercel** (see `vercel.json`). Clean URLs enabled — internal links can be written as `/fresno` or `fresno.html`.

## Design system ("calm concierge")

Light theme only. Warm paper ground, quiet type, orange rationed to accents.

| Token | Value | Use |
|---|---|---|
| `--ground` | `#FBF9F6` | page background |
| `--card` | `#FFFFFF` | cards, surfaces |
| `--ink` | `#231F1A` | text |
| `--stone` | `#6E655A` | secondary text |
| `--hairline` | `#E8E2D9` | borders, dividers |
| `--orange` | `#E85700` | brand accent — ONE primary CTA per viewport, kickers, small accents. Never a background wash for whole sections. |
| `--orange-deep` | `#C94B00` | hover states, orange text on light ground |
| `--orange-wash` | `#FBEADF` | selection states, soft washes |
| `--green` / `--green-wash` | `#3E7C4F` / `#E9F2EB` | semantic only: the "Delivering today" availability chip |

- **Type:** Bricolage Grotesque for display headings (`.font-display`, sentence case, tight tracking); Outfit for body; JetBrains Mono ONLY for prices/phone numbers (`.price`, tabular). **No italic-uppercase headlines, ever** — that was the old brand.
- **Shared classes** in `css/styles.css`: `.card`, `.kicker`/`.kicker--muted`, `.chip`/`.chip--green`, `.btn-primary`/`.btn-ghost`, `.price`, `.pill-promise`, `.input`, `.pull-quote`, plus JS state classes `.is-selected`, `.cal-cell*`, `.zip-ok/.zip-out/.zip-err` (app.js toggles these — restyle in CSS, not in JS strings).

## Brand voice

Calm concierge in a gritty industry: empathetic, transparent, hyper-local, approachable. Sentence case everywhere. Short declarative sentences, no shouting, no hype words. "No call center. No broker. You're texting the brothers who own the trucks." Time promises are part of the voice: reply in ~15 min, often same-day, pickup within 24 hrs — don't remove them, they're commitments.

## Pricing copy rules

Flat rates are **published**: 14-yard **$399 flat**, 20-yard **$499 flat** — 7-day rental, delivery, pickup, disposal, and mattresses/appliances/furniture included. Always pair with the protection line: "Includes up to 2 tons. Dirt, concrete, and roofing are quoted up front." If rates change, update: visible prices (search `$399`/`$499`), `pricing.*` i18n values (EN+ES), JSON-LD Offer `price` fields, and meta descriptions.

## The three differentiators

Every landing page surfaces these (the "reassurance row" — 3 hairline-divided columns after the hero; copy the markup + `reassure.*` i18n keys from `index.html`):

1. **Same-day, actually** — answered around the clock; same-day drops across Fresno & Clovis; honest ETAs when today isn't possible.
2. **One price covers it** — the quote is the invoice; mattresses, appliances, furniture included; no per-item surcharges.
3. **Licensed county hauler** — Fresno County franchise agreement; legally authorized, insured, accountable.

## Page pattern

Every page is a standalone HTML file with: utility bar (green availability chip + `#langBtn` + `#topPhone`) → sticky nav (light `.glass`, logo links `/`, one orange `#openQuote`) → `<main>` → footer (`bg-card`) → sticky mobile CTA → SMS modal + quote modal → `i18n.js`/`app.js` script pair. There is no component system — when you change shared chrome on one page, update all pages (`index.html` is the canonical copy source).

Current pages: `index.html`, `fresno.html`, `clovis.html`, `contractors.html`, `cleanouts.html`, six neighborhood pages (`tower-district.html`, `woodward-park.html`, `fig-garden.html`, `sunnyside.html`, `old-town-clovis.html`, `harlan-ranch.html`), and `404.html`.

## i18n rules

- Every copy change updates **both** `en` and `es` blocks in `js/i18n.js` in the same edit — missing keys fail silent (English leaks into Spanish mode).
- Default text inside a `data-i18n` element must match the EN value or first paint flickers.
- Don't remove the EN/ES toggle or `data-i18n` attributes.

## SEO conventions

- Every page has three `application/ld+json` blocks: `LocalBusiness`, `FAQPage`, `BreadcrumbList` (cleanouts has a fourth, Service). Keep them in sync when copying templates.
- `makesOffer` entries carry `"price": "399.00"` / `"499.00"` — keep in sync with visible rates.
- FAQPage answers must match the visible FAQ text on the page.
- Full OG tags + `canonical` on every page.
- **Do NOT add `aggregateRating`** to any JSON-LD until a real, verifiable review source is wired up.
- Google review place ID is `…dEBM` (single source: `BUSINESS.googleReviewUrl` in app.js; links carry `data-review-link`).
- Update `sitemap.xml` by hand when adding a page. `robots.txt` is `Allow: /` + sitemap — don't change.

## Assets

- Logo: `assets/logo.webp` (283x100, nav + footer)
- Hero image: `images/hero-dumpster.webp` (1024x1024), family photo: `images/family-photo.webp`, roll-off shot: `images/big-bros-rolloff.png` (size cards)
- Google favicon verification meta is on every page — keep it.

## Phone / contact

- Phone: `+1-559-495-8034` → display as `(559) 495‑8034` (non-breaking hyphens `&#8209;` or `‑`), wrapped in `.price` for tabular mono.
- SMS body prefill pattern: `sms:+15594958034?&body=...` URL-encoded

## What NOT to do

- Don't add a framework or a bundler. The only build step is the Tailwind CLI (`npm run build`).
- Don't re-introduce the Tailwind Browser CDN script — always use the compiled `css/tailwind.css`.
- Don't add new CSS files — extend `css/styles.css` or use Tailwind utilities.
- Don't reintroduce the dark/industrial style: no `zinc-*` classes, no italic-uppercase headlines, no noise overlays, no pulsing CTAs, no orange section backgrounds.
- Don't put color literals in `js/app.js` — toggle the CSS state classes instead.
- Don't add `aggregateRating` without real review data.
- Don't duplicate a city page for an unserved area. Current service area is Fresno + Clovis (plus surrounding Fresno County). Don't create pages for Sanger, Selma, Kerman, or Madera without confirmation.
- Don't remove the EN/ES language toggle or `data-i18n` attributes without updating `js/i18n.js`.
