import type { StaticImageData } from 'next/image';
import floristImage from '../assets/florist.webp';
import delivery1Image from '../assets/delivery1.webp';
import floristPackingImage from '../assets/florist_packing.webp';

/**
 * Single source of truth for articles. Everything else — route metadata, the
 * sitemap, the article carousel, the /articles index, the [slug] static params,
 * and each article page's <head> + JSON-LD — derives from this list. Adding or
 * removing an article means editing this file plus the article's own component
 * (its body) and FAQ entry (data/faqs.ts).
 */
export type ArticleMeta = {
  slug: string;
  /** SEO <title> (brand appended by the layout template) and JSON-LD headline. */
  seoTitle: string;
  /** On-page H1, index card, and carousel label. */
  displayTitle: string;
  description: string;
  ogImage: string;
  datePublished: string;
  dateModified: string;
  /** Card image used by the article carousel. */
  carouselImage: StaticImageData;
  carouselAlt: string;
};

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'best-flower-subscription-services-au',
    seoTitle: 'Best Flower Subscription Services Australia (2026)',
    displayTitle: 'Best Flower Subscription Services in Australia (2026)',
    description:
      'Compare Australian flower subscriptions for fresh weekly, fortnightly, and monthly flowers, including flexible national options and local florist plans.',
    ogImage: '/static/og-images/og-flower-subscription-au.webp',
    datePublished: '2026-01-19T00:00:00Z',
    dateModified: '2026-07-14T00:00:00Z',
    carouselImage: floristImage,
    carouselAlt: 'A guide to the best flower subscription services in Australia',
  },
  {
    slug: 'best-flower-delivery-perth',
    seoTitle: 'Best Flower Delivery Services Perth (2026)',
    displayTitle: 'The Best Flower Delivery Services in Perth (2026 Guide)',
    description:
      'An in-depth guide to the best flower delivery services in Perth, broken down by best overall, fastest, and most affordable.',
    ogImage: '/static/og-images/og-flower-delivery-perth.webp',
    datePublished: '2026-01-19T00:00:00Z',
    dateModified: '2026-07-14T00:00:00Z',
    carouselImage: floristPackingImage,
    carouselAlt: 'A guide to the best flower delivery services in Perth',
  },
  {
    slug: 'best-flower-delivery-sydney',
    seoTitle: 'Best Flower Delivery Services Sydney (2026)',
    displayTitle: 'Best Flower Delivery Services in Sydney (2026)',
    description:
      'Compare Sydney flower delivery services by same-day cutoffs, bouquet style, delivery coverage, pricing, and gifting experience.',
    ogImage: '/static/og-images/og-flower-delivery-sydney.webp',
    datePublished: '2026-01-19T00:00:00Z',
    dateModified: '2026-07-14T00:00:00Z',
    carouselImage: delivery1Image,
    carouselAlt: 'A guide to the best flower delivery services in Sydney',
  },
  {
    slug: 'best-flower-delivery-adelaide',
    seoTitle: 'Best Flower Delivery Services Adelaide (2026)',
    displayTitle: 'The Best Flower Delivery Services in Adelaide (2026 Guide)',
    description:
      'A complete look at the top flower delivery services in Adelaide, tailored for quality, speed, and price.',
    ogImage: '/static/og-images/og-flower-delivery-adelaide.webp',
    datePublished: '2026-01-21T00:00:00Z',
    dateModified: '2026-07-14T00:00:00Z',
    carouselImage: floristPackingImage,
    carouselAlt: 'A guide to the best flower delivery services in Adelaide',
  },
  {
    slug: 'best-flower-delivery-darwin',
    seoTitle: 'Best Flower Delivery Services Darwin (2026)',
    displayTitle: 'The Best Flower Delivery Services in Darwin (2026 Guide)',
    description:
      'A complete guide to the top flower delivery services serving Darwin - broken down by best overall, fastest delivery, and most affordable options.',
    ogImage: '/static/og-images/og-flower-delivery-darwin.webp',
    datePublished: '2026-01-21T00:00:00Z',
    dateModified: '2026-07-14T00:00:00Z',
    carouselImage: floristPackingImage,
    carouselAlt: 'A guide to the best flower delivery services in Darwin',
  },
  {
    slug: 'best-flower-delivery-melbourne',
    seoTitle: 'Best Flower Delivery Services Melbourne (2026)',
    displayTitle: 'The Best Flower Delivery Services in Melbourne (2026 Guide)',
    description:
      'A comprehensive guide to the top flower delivery services in Melbourne, broken down by best overall, fastest delivery, and most affordable options.',
    ogImage: '/static/og-images/og-flower-delivery-melbourne.webp',
    datePublished: '2026-01-21T00:00:00Z',
    dateModified: '2026-07-14T00:00:00Z',
    carouselImage: floristPackingImage,
    carouselAlt: 'A guide to the best flower delivery services in Melbourne',
  },
];

export const articleBySlug: Record<string, ArticleMeta> = Object.fromEntries(
  ARTICLES.map((article) => [article.slug, article]),
);
