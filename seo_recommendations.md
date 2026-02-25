# SEO Recommendations — FutureFlower

**Stack:** Vite + React SPA, react-helmet-async, react-router-dom, Tailwind CSS. Deployed at futureflower.app.

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
