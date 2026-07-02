# Coldman Booking Landing

Bilingual landing page selling a turnkey productized service: a website with online booking for appointment-based local businesses.

## Structure

```
/en/booking.html   ← English page
/uk/booking.html   ← Ukrainian page
/css/booking.css   ← shared design system (tokens, components)
/js/booking.js     ← FAQ accordion, scroll reveal, form submit
```

The two HTML files are standalone — they share CSS and JS but each carries its own copy, meta tags, and `lang` attribute. Adding a third language = copy `/en/` to a new folder, translate, add a `lang-toggle` option.

## Where to edit

### Copy and structure
- Open `/en/booking.html` or `/uk/booking.html`. Sections are clearly labeled with HTML comments (`<!-- ============ HERO ============ -->`, etc.).
- All visible text is inline HTML. Search-and-replace works.
- For larger copy passes, edit section by section in this order: hero → industries → how → features → compare → pricing → FAQ → CTA.

### Pricing
- Pricing lives in the `<!-- ============ PRICING ============ -->` block.
- Two `<div class="plan">` cards: Standard and Premium.
- Update the `.plan__price b` for the headline number, `.plan__price small` for the suffix, and `.plan__feats` for the feature list. Don't forget to mirror changes in both language files.

### Industries
- The `<!-- ============ INDUSTRIES ============ -->` block holds 8 `.industry` cards. Duplicate or remove cards in a 4-column grid (auto-wraps on mobile).

### FAQ
- Items in the `<!-- ============ FAQ ============ -->` block. Add `<div class="faq__item">` entries — the accordion script handles the rest.

### Hero booking mockup
- Pure HTML inside `<div class="mock">`. The slot grid uses `.mock__slot`, `.is-taken`, `.is-active` classes. Reorder or add more slots freely.

## Form submission

The lead form posts to Formspree:

```js
const FORMSPREE_ID = "xpzgwqab"; // in /js/booking.js
```

Replace with the real Formspree endpoint (or swap to a different handler). The script handles:
- POST to `https://formspree.io/f/{ID}` with form data
- Shows `.form__success` on success
- Button state changes via `data-sending` / `data-sent` / `data-error`

## Design system

All design tokens live in `:root` at the top of `/css/booking.css`:

- Colors: `--bone`, `--ink`, `--accent` (terracotta), `--premium` (dark card)
- Type: `--serif` (Instrument Serif display), `--sans` (Inter body)
- Spacing: `--container`, `--gutter`
- Radii / shadows

Re-skin by changing these tokens. The whole page re-themes from there.

## SEO

- Each page sets its own `<title>`, `<meta name="description">`, and `lang` attribute.
- `hreflang` links are wired through the language toggle (`hreflang="en"` / `hreflang="uk"`).
- Add `og:image` and Twitter card meta when you have social artwork ready.
- For sitemap coverage, add both URLs to `sitemap.xml` with the right `hreflang` annotations.

## Run locally

Static — no build step.

```sh
python3 -m http.server 8000
# then open http://localhost:8000/en/booking.html
```

Or open the HTML file directly in a browser.

## Adding a new language

1. Copy `/en/booking.html` to `/xx/booking.html`.
2. Translate every text node (keep the HTML structure intact).
3. Update `<html lang="xx">`, `<title>`, `<meta description>`, and `og` tags.
4. In both `/en/booking.html` and `/uk/booking.html`, add the new language option to `.lang-toggle`.
5. In the new file, set its toggle link to `is-active` and the others to plain.
