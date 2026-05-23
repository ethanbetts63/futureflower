# FutureFlower SEO Action Plan

## Critical

No critical crawl/indexing blocker was found.

## High Priority

1. Improve CTR on pages already getting impressions.
   - Pages: `/articles/best-flower-subscription-services-eu`, UK/AU/NZ subscription articles.
   - Actions: rewrite title/meta, add short-answer block, add comparison table, add "best for" summaries.
   - Expected impact: more clicks from existing rankings.

2. Upgrade the "best" articles from thin comparison posts into credible decision pages.
   - Add visible author, reviewer, and updated date.
   - Add external citations to service pricing, delivery, cancellation, and coverage claims.
   - Add methodology: how services were selected and compared.
   - Add tables for price, frequency, delivery area, cancellation, tracking, and bouquet size.

3. Build commercial landing pages for demand already visible in GSC.
   - First batch:
     - `/flower-subscription-uk`
     - `/flower-subscription-australia`
     - `/flower-subscription-new-zealand`
     - `/flower-delivery-sydney`
   - Each page needs unique local copy, FAQ, service schema, internal links, and conversion CTAs.

## Medium Priority

4. Add missing structured data.
   - Add WebSite schema site-wide.
   - Add WebPage schema for public routes.
   - Add BreadcrumbList schema to articles and landing pages.
   - Strengthen Article schema with author/date/publisher/image fields.

5. Harden technical SEO.
   - Add security headers in Next config:
     - content-security-policy
     - x-content-type-options
     - referrer-policy
     - frame-ancestors or x-frame-options
   - Remove `priority` and `changefreq` from sitemap.
   - Add `lastModified` to sitemap entries if reliable dates are available.

6. Fix image SEO issues.
   - Keep decorative icons empty alt.
   - Improve weak descriptive alt on meaningful images.
   - Add width/height or aspect-ratio on image containers.
   - Lazy-load below-the-fold imagery.

7. Improve AI search readiness.
   - Add 134-167 word self-contained answer blocks to key articles.
   - Add "Key takeaways" blocks.
   - Add question sections that match GSC queries:
     - delivery when nobody is home
     - easy cancellation
     - stem count and bouquet size
     - tracking and delivery notifications
     - subscription vs one-off cost

## Low Priority

8. Expand `llms.txt` with direct links to key pages.
9. Monitor `/order`, `/login`, `/forgot-password`, and terms URLs in GSC.
10. Consider IndexNow only if Bing discovery speed matters.

## First 10 Tasks

1. Update EU article title/meta and top summary.
2. Add EU article comparison table and citations.
3. Add visible author/date/reviewer component to article layout.
4. Add Article + BreadcrumbList schema to articles.
5. Create `/flower-subscription-uk`.
6. Create `/flower-delivery-sydney`.
7. Add internal links from Sydney article to Sydney landing page.
8. Remove sitemap priority/changefreq.
9. Add security headers.
10. Re-export GSC after 28 days and compare CTR/query movement.
