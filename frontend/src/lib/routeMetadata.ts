import type { Metadata } from "next";
import { SITE_URL } from "./seo";
import { ARTICLES } from "./articles";

export type RouteMetadata = {
  title: string;
  description?: string;
  path: string;
  ogType?: "website" | "article";
  ogImage?: string;
};

// Article route metadata is derived from the single article registry (lib/articles.ts).
const articleRoutes: Record<string, RouteMetadata> = Object.fromEntries(
  ARTICLES.map((article) => [
    `/articles/${article.slug}`,
    {
      title: article.seoTitle,
      description: article.description,
      path: `/articles/${article.slug}`,
      ogType: "article" as const,
    },
  ]),
);

const publicRoutes: Record<string, RouteMetadata> = {
  "/": {
    // NOTE: the "%s | FutureFlower" title template in app/layout.tsx does NOT apply
    // to the homepage — Next.js only applies a template to CHILD segments, and
    // app/page.tsx shares the root segment with app/layout.tsx. So the brand must be
    // baked into the homepage title explicitly here (every other route gets it via
    // the template).
    title: "Australian Florist-Led Flower Delivery | FutureFlower",
    description:
      "Tell us the occasion, budget, and flower preferences. A local Australian florist designs a bouquet that fits.",
    path: "/",
    ogImage: "/og-images/og-homepage.webp",
  },
  "/florists": {
    title: "For Florists | Grow Your Revenue",
    description:
      "Extend your service beyond today's purchase. Offer scheduled deliveries and subscriptions - all without adding admin, complexity, or cost.",
    path: "/florists",
    ogImage: "/og-images/og-homepage.webp",
  },
  "/affiliates": {
    title: "Affiliates | Earn by Gifting",
    description:
      "Help your followers get a better deal on flower deliveries. Earn $5-$25 per delivery while giving your community $5 off their first bouquet.",
    path: "/affiliates",
    ogImage: "/og-images/og-affiliates.webp",
  },
  "/pricing": {
    title: "Flower Delivery Pricing",
    description:
      "Simple, transparent flower delivery pricing. Set your budget and a local Australian florist designs the bouquet, delivery included. Recurring subscriptions available too.",
    path: "/pricing",
  },
  "/flower-subscription": {
    title: "Flower Subscription Delivery in Australia",
    description:
      "Set up a recurring flower subscription designed by a local Australian florist. Choose your frequency and budget, pause anytime, and get fresh seasonal bouquets on repeat.",
    path: "/flower-subscription",
  },
  "/birthday-flower-delivery": {
    title: "Birthday Flower Delivery",
    description:
      "Send fresh birthday flowers from local florists. Pick a date, set a budget, and we handle the rest with free delivery.",
    path: "/birthday-flower-delivery",
    ogImage: "/og-images/og-birthday-flowers.webp",
  },
  "/valentines-day-flower-delivery": {
    title: "Valentine's Day Flower Delivery",
    description:
      "Send fresh Valentine's Day flowers from local florists. Set a budget, add preferences, and choose February 14.",
    path: "/valentines-day-flower-delivery",
  },
  "/mothers-day-flower-delivery": {
    title: "Mother's Day Flower Delivery",
    description:
      "Send fresh Mother's Day flowers from local florists. Set a budget, add preferences, and choose Mother's Day.",
    path: "/mothers-day-flower-delivery",
  },
  "/flower-delivery-perth": {
    title: "Flower Delivery Perth",
    description:
      "Fresh flower delivery in Perth from local florists. Pick a date, set a budget, and add your preferences.",
    path: "/flower-delivery-perth",
    ogImage: "/og-images/og-flower-delivery-perth.webp",
  },
  "/articles": {
    title: "Flower Delivery Guides",
    description:
      "Explore articles, insights, and guides on long-term floral planning, personal growth, and making sure you never forget the important stuff.",
    path: "/articles",
  },
  ...articleRoutes,
};

const noindexPrefixes = [
  "/order",
  "/login",
  "/forgot-password",
  "/reset-password-confirm",
  "/dashboard",
  "/checkout",
  "/payment-status",
  "/create-account",
  "/partner",
  "/terms-and-conditions",
  "/blocklist-success",
];

function metadataFromRoute(route: RouteMetadata): Metadata {
  const canonicalUrl = `${SITE_URL}${route.path}`;
  const imageUrl = route.ogImage
    ? route.ogImage.startsWith("http")
      ? route.ogImage
      : `${SITE_URL}${route.ogImage}`
    : `${SITE_URL}/og-images/og-homepage.webp`;

  return {
    title: route.title,
    description: route.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: route.title,
      description: route.description,
      type: route.ogType ?? "website",
      url: canonicalUrl,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [imageUrl],
    },
  };
}

/**
 * Raw content registry lookup — the single source of truth for a route's
 * title/description/ogImage/ogType. Used both for Next page metadata and for
 * the JSON-LD emitted by <JsonLd path="…" />, so the two never drift.
 */
export function getRouteContent(path: string): RouteMetadata | undefined {
  return publicRoutes[path];
}

export function getPathFromSlug(slug?: string[]) {
  if (!slug || slug.length === 0) {
    return "/";
  }

  return `/${slug.join("/")}`;
}

export function getRouteMetadata(path: string): Metadata {
  const route = publicRoutes[path];

  if (route) {
    return metadataFromRoute(route);
  }

  const noindex = noindexPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );

  if (noindex) {
    return {
      title: "FutureFlower",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "FutureFlower",
    robots: {
      index: false,
      follow: false,
    },
  };
}
