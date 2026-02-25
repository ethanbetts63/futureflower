# SEO Recommendations — FutureFlower

**Stack:** Vite + React SPA, react-helmet-async, react-router-dom, Tailwind CSS. Deployed at futureflower.app.

---

## 1. Technical: Client-Side Rendering (Critical)

**Issue:** This is a pure CSR React app. All meta tags (`<title>`, `<meta>`, structured data) are injected by `react-helmet-async` after JS executes. Google crawls in two waves — a fast first pass (sees bare HTML shell) and a delayed second render pass. For a new/low-authority site, the second pass may be slow or missed entirely.

**Impact:** Article pages are the primary organic traffic play. Slow rendering means delayed indexing and potentially missed crawls. Worth verifying articles are indexed correctly in Google Search Console.

**Options (best to minimal):**
- **Best:** Migrate article pages to a framework that supports SSG (Next.js static export, Astro). Articles are purely static content — ideal SSG candidates.
- **Alternative:** Add a pre-rendering layer (Prerender.io, Netlify pre-rendering) that caches rendered HTML for bots.
- **Minimal:** Monitor Google Search Console → URL Inspection tool to confirm structured data is being detected on article pages.

---

## 2. Sitemap

**Status: ✅ Working** (`sitemaps.py` confirmed, robots.txt references `https://www.futureflower.app/sitemap.xml` correctly).

**To do:** Verify the sitemap includes all 10 article URLs and is submitted and accepted in Google Search Console.

---

## 3. Homepage Title & Meta Description

**Current state (already updated — looks good):**
- Title: `"FutureFlower | Flower Delivery & Subscriptions"` ✅
- Description: `"Personalized, fresh flowers. Get free delivery, and support local florists. Pick a date, pick a budget, and we handle the rest. More flowers, less hassle."` ✅

**One remaining consideration:** You serve Australia, UK, EU, US, NZ but are targeting Australia first. If you want to signal geography, consider testing: `"Flower Delivery & Subscriptions in Australia | FutureFlower"`. Not urgent at this stage.

---

## 4. Homepage H1 — Suggestions Only

**Current:** `"The gift that keeps on giving."` — no flower or delivery keywords.

**Option A — Replace the tagline directly (keeping the italic 'keeps' pattern):**
- `"Flower delivery that keeps on giving."`
- `"The flower subscription that keeps on giving."`
- `"Fresh flowers that keep on arriving."`

**Option B — Keep the tagline, add a keyword-rich subtitle/H2 visible early on the page:**
This avoids disrupting the brand voice while still giving Google a topic signal. Something like:
> *"Fresh flower delivery and subscriptions — Australia, UK, and beyond."*

The H2 approach is lower risk and probably cleaner for the existing hero design.

---

## 5. Pricing Page (High Priority — Not Yet Done)

**Current:**
- Title: `"Pricing | FutureFlower"` — very weak
- Description: `"Give florists a budget and preferences. No catalogs, just the freshest, seasonal flowers."` — no pricing keywords

**Recommended:**
- Title: `"Flower Subscription Pricing Plans | FutureFlower"`
- Description: `"Simple, transparent pricing for flower delivery and subscriptions. Set your budget, choose your dates, and local florists handle the rest."`

**Structured data missing:** The pricing page has no schema at all. Adding a `Service` schema with an `offers` property listing subscription tiers would help eligibility for pricing-related rich results.

---

## 6. Article Author Schema Fix (Not Yet Done)

**Issue:** All 10 articles use `"@type": "Person"` for `"The FutureFlower Team"` — a team is not a person. Google validates this.

**Fix:** In every article's `structuredData` object, change:
```js
author: { '@type': 'Person', name: articleDetails.authorName }
```
to:
```js
author: { '@type': 'Organization', name: articleDetails.publisherName }
```

---

## 7. Article `dateModified` — ✅ Fixed

All 10 articles updated to `2026-02-25T00:00:00Z`. Should be updated whenever content is meaningfully changed.

---

## 8. Internal Links from Articles to Homepage — ✅ Done

1–2 natural internal links added to each article using keyword-rich anchor text (e.g., "flower delivery subscription", "recurring flower delivery", "date-based flower subscription", "occasion-based flower subscription") linking to `/`. No brand name in the link text.

---

## 9. LocalBusiness Schema — Not Recommended for Online-Only

**Decision:** `LocalBusiness` schema is intended for businesses with a physical location and primarily feeds Google My Business / local pack results. Since FutureFlower is entirely online, using it would be technically incorrect and could trigger Google validation warnings.

**Instead — enrich the existing Organization schema on the homepage:**
```json
{
  "@type": "Organization",
  "name": "FutureFlower",
  "url": "https://www.futureflower.app",
  "logo": "https://www.futureflower.app/static/logo_128_black.png",
  "areaServed": ["Australia", "United Kingdom", "United States", "Canada", "New Zealand", "Europe"],
  "serviceType": ["Flower Delivery", "Flower Subscription Service"],
  "sameAs": [
    "https://www.instagram.com/futureflower_app",
    "https://www.facebook.com/futureflower"
  ],
  "founder": {
    "@type": "Person",
    "name": "Ethan Betts"
  }
}
```

`areaServed` and `serviceType` tell Google exactly what you do and where without claiming a physical presence you don't have. `sameAs` is an important E-E-A-T signal.

---

## 10. Organization Schema Logo (Minor, Not Yet Done)

**Current:** `"logo": "https://www.futureflower.app/favicon.ico"` (16–32px image)

**Impact on ranking:** None directly. But Google's Knowledge Panel requires a logo of at least 112×112px. A favicon is too small.

**Fix:** Change the logo URL in the homepage `organizationSchema` to:
```
"https://www.futureflower.app/static/logo_128_black.png"
```
This is already used in every article's publisher schema — just needs to be consistent on the homepage.

---

## 11. OG Images — Verify They Exist

Several article files have comments like `// Assuming this will be created later`. Confirm these files exist in production:
- `/static/og-images/og-flower-delivery-melbourne.webp`
- `/static/og-images/og-flower-delivery-adelaide.webp`
- `/static/og-images/og-flower-delivery-darwin.webp`

If missing, all social shares and Google Discover cards fall back to the generic fallback image.

---

## 12. Occasion-Specific Landing Pages (Long-Term, High Value)

High search-volume keywords with clear purchase intent that currently have no matching page:

| Keyword | Monthly Volume (AU est.) |
|---|---|
| "birthday flower delivery Australia" | High |
| "anniversary flower delivery" | High |
| "Mother's Day flowers Australia" | Very High |
| "Valentine's Day flower delivery" | Very High |
| "sympathy flowers delivery" | Medium |

These would be purpose-built landing pages (not articles about competitors) that drive directly to the booking flow. Long-term play but high ROI.

---

## 13. About Page / E-E-A-T

Google's quality guidelines reward Experience, Expertise, Authoritativeness, and Trustworthiness. An About page with founder story, company mission, and team background would:
- Improve domain trust signals
- Enable a richer Knowledge Panel
- Complement the `sameAs` links in the Organization schema

---

## 14. Homepage FAQ Expansion

The homepage currently has 3 generic FAQs (reminders, refunds, countries). These produce FAQPage structured data via the `FaqV2` component — which is great. But adding keyword-rich questions would capture more rich snippets:

- `"What cities in Australia does this flower delivery service cover?"`
- `"How does a flower subscription work?"`
- `"Can I schedule a flower delivery for a future date?"`
- `"What's the difference between a one-time delivery and a flower subscription?"`

---

## Priority Summary

| # | Task | Impact | Status |
|---|------|--------|--------|
| 1 | SSR/pre-rendering for article pages | Very High | Not done |
| 2 | Sitemap verified in Search Console | High | ✅ Exists |
| 3 | Homepage title + meta | High | ✅ Done |
| 4 | Homepage H1 keyword addition | High | Not done |
| 5 | Pricing page title + meta + schema | High | Not done |
| 6 | Article author schema type fix | Medium | Not done |
| 7 | Article dateModified | Medium | ✅ Done |
| 8 | Internal links in articles | Medium | ✅ Done |
| 9 | LocalBusiness schema | N/A | Not applicable |
| 10 | Organization logo fix | Low | Not done |
| 11 | OG images verified | Medium | Verify |
| 12 | Occasion landing pages | High | Future |
| 13 | About page | Medium | Future |
| 14 | Homepage FAQ expansion | Medium | Not done |
