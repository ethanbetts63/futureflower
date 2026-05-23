# FutureFlower SEO Audit

Audit date: 2026-05-23  
Updated: 2026-05-23  
Site: https://www.futureflower.app/  
Scope: Organic SEO, content, indexability, sitemap, schema, image SEO, AI search readiness, and Search Console export analysis.  
Excluded by request: Speed and Core Web Vitals investigation. Performance is treated as neutral.

## Executive Summary

Estimated SEO health score: 68/100

FutureFlower has a solid technical base: the public pages are server-rendered, indexable, canonicalized, included in a clean sitemap, and Google has already crawled/indexed the core pages. The largest opportunity is not basic crawlability. It is matching the pages to search demand with stronger content depth, sharper SERP intent coverage, better proof, and better country/city targeting.

The Search Console exports show a clear pattern:

- Page export totals: 35 clicks and 4,192 impressions across the listed URLs.
- Query export totals: 1 click and 2,306 impressions across 249 visible queries. This mismatch is normal when exports are filtered/anonymized differently.
- Homepage performs best: 14 clicks, 165 impressions, 8.5% CTR, average position 6.2.
- The highest-impression page is `/articles/best-flower-subscription-services-eu`: 1,555 impressions, 3 clicks, 0.2% CTR, average position 7.7.
- Several long-tail subscription queries rank on page one but get no clicks, including position 3.7, 4.2, 5.7, and 7.5 queries.
- The Sydney article has 810 impressions but average position 47.8. It is visible to Google but not competitive for the main city query cluster.

Completed since the original audit:

- Added site-wide `WebSite` schema, page-level `WebPage` schema, `BreadcrumbList` schema, and stronger `Article` schema.
- Added technical security headers and cleaned sitemap metadata by removing `priority` and `changeFrequency`.
- Added reliable `lastModified` values to sitemap entries.
- Removed `FutureFlower` from public indexed article titles and shortened overlong titles/meta descriptions.
- Rewrote the indexed AU, EU, NZ, and Sydney articles with researched prose and outbound citations.
- Updated the shared article template and `/articles` page styling to match the AllBikes guide pattern.
- Reworked FAQs to use a wider AllBikes-style presentation.

Remaining top priorities:

1. Expand and localize commercial pages, especially Sydney, Australia, New Zealand, UK, and Perth.
2. Add visible author/date/methodology signals to article templates.
3. Fix image SEO quality issues and missing dimensions on important templates.
4. Strengthen internal linking once the new commercial pages exist.

## Evidence Used

- Live homepage fetch: 200 OK, no redirect, server-rendered HTML, content length about 73 KB.
- `robots.txt`: allows public pages and blocks private/account/checkout/admin flows.
- `sitemap.xml`: 20 URLs, all 200, no noindex, no canonical mismatch.
- SEO helper outputs:
  - Technical helper: indexable, self-canonical, mobile pass, critical SEO content visible in initial HTML.
  - Sitemap helper: score 98, all sitemap URLs 200.
  - Schema helper: homepage score 84, EU article score 76.
  - Content helper: EU article score 39, Sydney article score 35.
  - GEO helper: EU article score 58, llms.txt present, AI crawlers allowed.
  - Image helper: homepage image score 30.
- Local source inspected:
  - `frontend/src/app/robots.ts`
  - `frontend/src/app/sitemap.ts`
  - `frontend/src/lib/routeMetadata.ts`
  - `frontend/src/page_components/home.tsx`
  - article page components under `frontend/src/page_components/articles/`
- GSC exports:
  - `_docs/data/query_data_3_months_23_05_2026.csv`
  - `_docs/data/page_data_3_months_23_05_2026.csv`
  - `_docs/data/countries_data_3_months_23_05_2026.csv`

## Search Console Findings

### What Is Already Working

The homepage has meaningful brand and product visibility:

- `/`: 14 clicks, 165 impressions, 8.5% CTR, position 6.2.
- Queries like `future flower`, `future flowers`, and related terms are appearing, though brand ranking can still be improved.

Some informational/article content is already close to useful ranking positions:

- `/articles/best-flower-subscription-services-eu`: 1,555 impressions, position 7.7.
- `/birthday-flower-delivery`: 15 impressions, position 5.5.
- `/valentines-day-flower-delivery`: 5 impressions, position 6.6.
- Several UK subscription long-tail queries rank between positions 4 and 10.

### Main Performance Gap

The site has impressions without clicks. The clearest examples:

- `i want flowers that can be delivered even if im not home...`: 260 impressions, position 3.7, 0 clicks.
- `best flower subscription uk for seasonal flowers...`: 97 impressions, position 4.2, 0 clicks.
- `flower subscription uk bouquet size options...`: 89 impressions, position 5.7, 0 clicks.
- `can you recommend a uk flower subscription thats easy to cancel`: 72 impressions, position 8.4, 0 clicks.
- `/articles/best-flower-subscription-services-eu`: 1,555 impressions, 0.2% CTR.

This suggests the pages are being considered relevant, but snippets/titles/content positioning are not yet compelling enough, or the page does not directly answer the exact query in a visible way.

### Country Opportunity

Top country impressions:

- Australia: 943 impressions, position 45.8, 0.4% CTR.
- United States: 774 impressions, position 8.0, 1.9% CTR.
- New Zealand: 378 impressions, position 37.8, 0.8% CTR.
- Brazil: 311 impressions, position 7.8, 0 clicks.
- United Kingdom: 211 impressions, position 22.5, 0 clicks.

Australia and New Zealand have high impressions but poor positions, so they need stronger localized landing pages and continued article updates. The US is already closer to page one and should be improved for CTR and conversion.

## Technical SEO

Status: Good foundation. Core structured data and sitemap cleanup have now been implemented.

Strengths:

- Homepage returns 200 OK with no redirect chain.
- Critical content is present in initial HTML.
- Public sitemap is referenced in robots.txt.
- Sitemap contains 20 canonical public URLs.
- All sitemap URLs checked returned 200.
- Homepage canonical is self-referential.
- Private/account/checkout pages are disallowed or noindexed in local metadata rules.

Issues:

- `/terms-and-conditions` appeared in GSC page data even though the route is disallowed/noindexed in implementation. This may be historical, but it should be monitored.
- `/order`, `/login`, and `/forgot-password` also appear in GSC page data. They are low-volume, but private utility URLs should not accumulate index signals.

Remaining recommendations:

- Keep private routes out of sitemap and keep noindex rules on app/account/checkout flows.
- Consider adding a Search Console removal or temporary noindex validation for private utility URLs if they continue appearing.

## Sitemap And Robots

Status: Strong. Sitemap cleanup has now been implemented.

The sitemap is focused and clean:

- 1 sitemap file.
- 20 URLs.
- All checked URLs returned 200.
- No noindex URLs in sitemap.
- No canonical mismatches found.
- `priority` and `changeFrequency` have been removed.
- `lastModified` values have been added where reliable dates were available.

The current sitemap is intentionally small, which is fine for the current site. The issue is coverage, not format: there are only a few service/location pages despite GSC showing demand across multiple countries and cities.

Recommended sitemap expansion:

- Add localized commercial pages only when they have enough unique, useful content.
- Candidate pages from GSC demand:
  - `/flower-subscription-uk`
  - `/flower-subscription-australia`
  - `/flower-subscription-new-zealand`
  - `/flower-delivery-sydney`
  - `/flower-delivery-melbourne`
  - `/flower-delivery-adelaide`
  - `/flower-delivery-darwin`
  - `/flower-delivery-new-zealand`

## Content Quality

Status: Improved for the indexed AU, EU, NZ, and Sydney articles, with remaining work on non-indexed articles, template-level trust signals, and commercial landing pages.

The content helpers scored:

- EU subscription article: 39/100, 1,121 words.
- Sydney delivery article: 35/100, 1,133 words.

Original shared issues:

- Below the recommended depth for competitive blog posts.
- No external citations detected in visible HTML. Addressed for the indexed AU, EU, NZ, and Sydney article rewrites.
- Limited first-hand proof.
- Weak author/reviewer/date signals.
- No comparison tables.
- Several long sentences reduce scannability. Partially addressed by rewriting the indexed articles in a more editorial, less bullet-heavy style.

Content strategy issue:

The indexed articles often rank for commercial comparison intent, and four indexed pages have now been rewritten. Remaining article work should continue the same pattern across non-indexed article pages: researched prose, source links, direct answers, comparison structure, and stronger methodology/trust signals.

Remaining content upgrades:

- Extend the rewrite approach to the non-indexed article pages when they become priorities.
- Add a "Quick answer" block near the top of key article pages.
- Add comparison tables with columns such as service, best for, starting price, delivery area, same-day cutoff, subscription available, cancellation, and why each service was selected.
- Add a visible "How we chose" methodology.
- Add visible update date and author/reviewer treatment.
- Add "best for" snippets that match query variants: easy cancellation, lasts longest, bouquet size, stem count, delivery tracking, delivery when recipient is not home.

## On-Page SEO

Status: Improved metadata foundation, with remaining query alignment work on future commercial pages.

Strengths:

- Route-level metadata is centralized in `frontend/src/lib/routeMetadata.ts`.
- Public pages have titles, descriptions, canonicals, OG, and Twitter data.
- Homepage H1 is clear: "Better Flowers. Local Florists."
- Article pages generate metadata from the same route metadata system.

Remaining issues:

- Some non-indexed article titles/meta descriptions may still be broad because the recent cleanup focused on indexed pages.
- The highest-ranking queries are often question-like, so key articles should add explicit short answer sections.
- There is a mismatch between article ranking demand and commercial landing-page availability. For example, the site has an article about Sydney delivery but not a primary `/flower-delivery-sydney` landing page.
- The homepage title targets "Flower Delivery & Subscriptions", but the product's strongest differentiator is scheduled/recurring occasion gifting. That concept should be made more explicit in snippets and headings.

Completed title/meta cleanup:

- Removed `FutureFlower` suffixes from public indexed article titles.
- Shortened long article titles.
- Rewrote weak/long meta descriptions for the indexed AU, EU, NZ, and Sydney articles.

## AI Search And GEO

Status: Moderate, improved by schema and citation work.

Strengths:

- `llms.txt` is present and substantive.
- AI crawlers checked by the GEO helper are allowed.
- Structured data exists and has since been expanded with site-wide WebSite schema, page-level WebPage schema, BreadcrumbList schema, and strengthened Article schema.
- Content is server-rendered enough for basic extraction.
- Indexed AU, EU, NZ, and Sydney articles now include outbound source links.

Remaining weaknesses:

- No strong 134-167 word self-contained answer block was detected on the EU article.
- Author/date attribution is weak in visible content.
- Content has few concise, extractable fact blocks.

Recommendations:

- Add one "short answer" block near the top of each priority article, starting with indexed pages.
- Add "Key takeaways" and "Best for" bullets.
- Add visible date/author/reviewer.
- Add cited claims and outbound references.
- Add concise sections that directly answer GSC queries such as:
  - "Can flower subscriptions be delivered when nobody is home?"
  - "Which UK flower subscriptions are easiest to cancel?"
  - "What bouquet size or stem count should I expect?"
  - "Are flower subscriptions cheaper than ordering as needed?"

## Image SEO

Status: Weak on the homepage.

Image helper summary:

- 28 images detected.
- 0 missing alt attributes.
- 7 weak or filename-like alt values.
- 11 missing width/height attributes.
- 2 oversized images above 200 KB.
- 8 below-the-fold sampled images not lazy loaded.

Important note: Some empty alt attributes are correct for decorative icons/logos. Do not add noisy alt text to purely decorative images.

Recommendations:

- Improve descriptive alt text on meaningful content images.
- Keep decorative SVG/icon alt text empty.
- Add width/height or stable aspect-ratio containers for layout stability.
- Review large hero assets and OG images for size.
- Ensure below-the-fold article carousel and secondary content images lazy-load.

## Internal Linking

Status: Moderate.

Strengths:

- Homepage links to major public routes and article carousel.
- Footer links support discovery of service pages.
- Articles link back to homepage and related content.

Gaps:

- There is limited hub-and-spoke architecture around countries/cities.
- Articles do not consistently link to matching commercial landing pages because those pages do not yet exist.
- The blog index is not yet a strong topical hub for "flower subscriptions", "flower delivery", "Australia", "New Zealand", "UK", "Sydney", etc.

Recommendations:

- Build topic hubs:
  - Flower Subscriptions
  - Flower Delivery by City
  - Occasion Flower Delivery
  - Florist Partnership
- Link every "best X" article to the most relevant commercial page.
- Add contextual links between country pages, city pages, and article comparisons.
- Add visual breadcrumbs where they help navigation.

## Priority Issues

### Critical

No critical indexation blocker was found.

### High

1. High-impression page-one queries have near-zero CTR.
   - Evidence: EU article 1,555 impressions, 0.2% CTR, position 7.7; long-tail queries ranking position 3.7-8.4 with 0 clicks.
   - Status: indexed AU, EU, NZ, and Sydney article rewrites are complete; direct short-answer blocks are still recommended.

2. Remaining article trust signals are weak.
   - Evidence: article template still lacks visible author/date/methodology treatment.
   - Fix: add visible article trust block and methodology; extend the rewrite/citation approach to non-indexed articles when prioritized.

3. Missing localized commercial pages for demand already visible in GSC.
   - Evidence: Sydney, Australia, New Zealand, UK queries are appearing but mostly rank poorly.
   - Fix: create strong local landing pages, not thin duplicates.

### Medium

4. Image SEO needs cleanup.
   - Fix: improve weak alt text, dimensions, lazy loading, and oversized images.

### Low

6. Expand llms.txt with links to the highest-value pages.
7. Monitor private utility URLs in GSC and validate noindex/disallow behavior.

## 90-Day SEO Plan

### Weeks 1-2

- Completed: rewrote indexed AU, EU, NZ subscription articles and the indexed Sydney article.
- Remaining: rewrite non-indexed UK/US/Perth/Melbourne/Adelaide/Darwin articles when they become priorities.
- Add author/reviewer/date signals to article templates.
- Add short-answer blocks and comparison tables to the highest-impression indexed articles.

### Weeks 3-6

- Build localized commercial pages:
  - `/flower-subscription-uk`
  - `/flower-subscription-australia`
  - `/flower-subscription-new-zealand`
  - `/flower-delivery-sydney`
- Internally link articles to those pages.
- Add "subscription by use case" content for:
  - easy cancellation
  - delivery when not home
  - bouquet size/stem count
  - tracking and delivery notifications
  - weekly vs fortnightly vs monthly cadence

### Weeks 7-12

- Expand city/location pages based on GSC demand.
- Refresh the "best flower delivery" articles with deeper city-specific comparisons.
- Add review/proof assets, testimonials, partner florist examples, or operational detail.
- Re-check GSC query/page data for CTR and position movement.

## Suggested KPIs

- Increase EU article CTR from 0.2% to at least 1.5%.
- Move AU/NZ subscription articles toward top 10 average position.
- Move Sydney article from position 47.8 toward top 20.
- Grow non-branded clicks from subscription and city terms.
- Reduce visible private/utility URL impressions in GSC.

## Tool Limitations

- Speed/CWV was intentionally excluded from this audit. One technical helper emitted heuristic CWV data by default; those lines were ignored.
- No paid SERP, backlink, or keyword volume provider was used.
- Search Console exports reflect the provided 3-month files dated 2026-05-23 and may omit anonymized/low-volume query data.
- The audit used live fetches and local implementation review but did not modify production code.
