# FutureFlower SEO Action Plan

Updated: 2026-05-23

## Completed Since Audit

1. Added missing structured data.
   - Site-wide `WebSite` schema.
   - Page-level `WebPage` schema.
   - `BreadcrumbList` schema on public pages/articles.
   - Stronger `Article` schema with author, dates, publisher, and image handling.

2. Hardened technical SEO.
   - Added security headers in Next config.
   - Removed `priority` and `changeFrequency` from sitemap output.
   - Added `lastModified` values where reliable dates were available.

3. Cleaned article title/meta issues.
   - Removed `FutureFlower` from public indexed article titles.
   - Shortened overlong titles.
   - Improved long/weak meta descriptions for indexed pages.

4. Improved article content and presentation.
   - Rewrote the indexed AU, EU, NZ, and Sydney articles with researched prose and outbound citations.
   - Non-indexed article rewrites are not complete yet.
   - Reduced thin bullet-heavy formatting.
   - Updated the shared article template to match the AllBikes guide pattern.
   - Standardized article hero imagery and `/articles` hero imagery.

5. Improved FAQ presentation.
   - Reworked FAQ layout to match the wider AllBikes-style presentation.

## High Priority Remaining

1. Build commercial landing pages for demand already visible in GSC.
   - `/flower-subscription-uk`
   - `/flower-subscription-australia`
   - `/flower-subscription-new-zealand`
   - `/flower-delivery-sydney`

2. Add stronger internal linking once the commercial pages exist.
   - Link each "best X" article to its matching commercial landing page.
   - Link country pages to relevant city/service pages.
   - Link the `/articles` hub into the strongest commercial pages.

3. Add visible article trust signals.
   - Author line.
   - Last updated date.
   - Short methodology note for comparison articles.

## Medium Priority Remaining

4. Fix image SEO issues.
   - Keep decorative icons empty alt.
   - Improve weak descriptive alt on meaningful images.
   - Add width/height or aspect-ratio on image containers where missing.
   - Lazy-load below-the-fold imagery.

5. Improve AI search readiness.
   - Add short answer blocks to key indexed articles first.
   - Add concise question sections that match Search Console queries:
     - delivery when nobody is home
     - easy cancellation
     - stem count and bouquet size
     - tracking and delivery notifications
     - subscription vs one-off cost

## Low Priority Remaining

6. Expand `llms.txt` with direct links to key pages after the landing pages exist.
7. Monitor `/order`, `/login`, `/forgot-password`, and terms URLs in GSC.
8. Consider IndexNow only if Bing discovery speed matters.

## Next 7 Tasks

1. Add visible author/date/methodology treatment to article templates.
2. Create `/flower-delivery-sydney`.
3. Create `/flower-subscription-australia`.
4. Create `/flower-subscription-new-zealand`.
5. Create `/flower-subscription-uk`.
6. Add internal links from articles to the new commercial pages.
7. Rewrite the remaining non-indexed articles when they become GSC priorities.
