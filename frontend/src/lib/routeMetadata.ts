import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futureflower.app";

type RouteMetadata = {
  title: string;
  description?: string;
  path: string;
  ogType?: "website" | "article";
  ogImage?: string;
};

const publicRoutes: Record<string, RouteMetadata> = {
  "/": {
    title: "Australian Florist-Led Flower Delivery",
    description:
      "Tell us the occasion, budget, and flower preferences. A local Australian florist designs a bouquet that fits.",
    path: "/",
    ogImage: "/og-images/og-homepage.webp",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Have a question, suggestion, or need support? Get in touch with the FutureFlower team - we'd love to hear from you.",
    path: "/contact",
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
    title: "Flower Subscription Pricing Plans",
    description:
      "Simple, transparent pricing for flower delivery and subscriptions. Set your budget, choose your dates, and local florists handle the rest.",
    path: "/pricing",
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
      "Send fresh Valentine's Day flowers from local florists. Schedule your order months ahead - free delivery across Australia, the UK, the US, and more.",
    path: "/valentines-day-flower-delivery",
  },
  "/mothers-day-flower-delivery": {
    title: "Mother's Day Flower Delivery",
    description:
      "Send fresh Mother's Day flowers from local florists. Schedule ahead to guarantee delivery - free across Australia, the UK, the US, and more.",
    path: "/mothers-day-flower-delivery",
  },
  "/flower-delivery-perth": {
    title: "Flower Delivery Perth",
    description:
      "Fresh flower delivery in Perth from local florists. Pick a date, set a budget, and we handle the rest - free delivery on every order.",
    path: "/flower-delivery-perth",
    ogImage: "/og-images/og-flower-delivery-perth.webp",
  },
  "/articles": {
    title: "Flower Delivery Guides",
    description:
      "Explore articles, insights, and guides on long-term floral planning, personal growth, and making sure you never forget the important stuff.",
    path: "/articles",
  },
  "/articles/best-flower-subscription-services-au": {
    title:
      "Best Flower Subscription Services Australia (2026)",
    description:
      "Compare Australian flower subscriptions for fresh weekly, fortnightly, and monthly flowers, including flexible national options and local florist plans.",
    path: "/articles/best-flower-subscription-services-au",
    ogType: "article",
  },
  "/articles/best-flower-subscription-services-eu": {
    title:
      "Best Flower Subscription Services Europe (2026)",
    description:
      "Compare European flower subscription options by delivery coverage, bouquet quality, flexibility, gifting, and regional availability.",
    path: "/articles/best-flower-subscription-services-eu",
    ogType: "article",
  },
  "/articles/best-flower-subscription-services-nz": {
    title:
      "Best Flower Subscription Services NZ (2026)",
    description:
      "Compare New Zealand flower subscriptions by city coverage, frequency, price, bouquet style, and florist-led delivery options.",
    path: "/articles/best-flower-subscription-services-nz",
    ogType: "article",
  },
  "/articles/best-flower-delivery-perth": {
    title: "Best Flower Delivery Services Perth (2026)",
    description:
      "An in-depth guide to the best flower delivery services in Perth, broken down by best overall, fastest, and most affordable.",
    path: "/articles/best-flower-delivery-perth",
    ogType: "article",
  },
  "/articles/best-flower-delivery-sydney": {
    title: "Best Flower Delivery Services Sydney (2026)",
    description:
      "Compare Sydney flower delivery services by same-day cutoffs, bouquet style, delivery coverage, pricing, and gifting experience.",
    path: "/articles/best-flower-delivery-sydney",
    ogType: "article",
  },
  "/articles/best-flower-delivery-adelaide": {
    title:
      "Best Flower Delivery Services Adelaide (2026)",
    description:
      "A complete look at the top flower delivery services in Adelaide, tailored for quality, speed, and price.",
    path: "/articles/best-flower-delivery-adelaide",
    ogType: "article",
    ogImage: "/static/og-images/og-flower-delivery-adelaide.webp",
  },
  "/articles/best-flower-delivery-darwin": {
    title: "Best Flower Delivery Services Darwin (2026)",
    description:
      "A complete guide to the top flower delivery services serving Darwin - broken down by best overall, fastest delivery, and most affordable options.",
    path: "/articles/best-flower-delivery-darwin",
    ogType: "article",
  },
  "/articles/best-flower-delivery-melbourne": {
    title:
      "Best Flower Delivery Services Melbourne (2026)",
    description:
      "A comprehensive guide to the top flower delivery services in Melbourne, broken down by best overall, fastest delivery, and most affordable options.",
    path: "/articles/best-flower-delivery-melbourne",
    ogType: "article",
  },
};

const noindexPrefixes = [
  "/order",
  "/login",
  "/forgot-password",
  "/reset-password-confirm",
  "/dashboard",
  "/checkout",
  "/payment-status",
  "/event-gate",
  "/create-account",
  "/single-delivery-flow",
  "/partner",
  "/terms-and-conditions",
  "/blocklist-success",
];

function metadataFromRoute(route: RouteMetadata): Metadata {
  const canonicalUrl = `${siteUrl}${route.path}`;
  const imageUrl = route.ogImage
    ? route.ogImage.startsWith("http")
      ? route.ogImage
      : `${siteUrl}${route.ogImage}`
    : `${siteUrl}/og-images/og-homepage.webp`;

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
