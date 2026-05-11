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
    title: "FutureFlower | Flower Delivery & Subscriptions",
    description:
      "Free delivery from local florists. Pick a date, set a budget, and we handle the rest - across Australia, the UK, the US, and more.",
    path: "/",
    ogImage: "/og-images/og-homepage.webp",
  },
  "/contact": {
    title: "Contact Us | FutureFlower",
    description:
      "Have a question, suggestion, or need support? Get in touch with the FutureFlower team - we'd love to hear from you.",
    path: "/contact",
  },
  "/florists": {
    title: "FutureFlower for Florists | Grow Your Revenue",
    description:
      "Extend your service beyond today's purchase. Offer scheduled deliveries and subscriptions - all without adding admin, complexity, or cost.",
    path: "/florists",
    ogImage: "/og-images/og-homepage.webp",
  },
  "/affiliates": {
    title: "FutureFlower Affiliates | Earn by Gifting",
    description:
      "Help your followers get a better deal on flower deliveries. Earn $5-$25 per delivery while giving your community $5 off their first bouquet.",
    path: "/affiliates",
    ogImage: "/og-images/og-affiliates.webp",
  },
  "/pricing": {
    title: "Flower Subscription Pricing Plans | FutureFlower",
    description:
      "Simple, transparent pricing for flower delivery and subscriptions. Set your budget, choose your dates, and local florists handle the rest.",
    path: "/pricing",
  },
  "/birthday-flower-delivery": {
    title: "Birthday Flower Delivery | FutureFlower",
    description:
      "Send fresh birthday flowers from local florists. Pick a date, set a budget, and we handle the rest - free delivery across Australia, the UK, the US, and more.",
    path: "/birthday-flower-delivery",
    ogImage: "/og-images/og-birthday-flowers.webp",
  },
  "/valentines-day-flower-delivery": {
    title: "Valentine's Day Flower Delivery | FutureFlower",
    description:
      "Send fresh Valentine's Day flowers from local florists. Schedule your order months ahead - free delivery across Australia, the UK, the US, and more.",
    path: "/valentines-day-flower-delivery",
  },
  "/mothers-day-flower-delivery": {
    title: "Mother's Day Flower Delivery | FutureFlower",
    description:
      "Send fresh Mother's Day flowers from local florists. Schedule ahead to guarantee delivery - free across Australia, the UK, the US, and more.",
    path: "/mothers-day-flower-delivery",
  },
  "/flower-delivery-perth": {
    title: "Flower Delivery Perth | FutureFlower",
    description:
      "Fresh flower delivery in Perth from local florists. Pick a date, set a budget, and we handle the rest - free delivery on every order.",
    path: "/flower-delivery-perth",
    ogImage: "/og-images/og-flower-delivery-perth.webp",
  },
  "/articles": {
    title: "FutureFlower Blog",
    description:
      "Explore articles, insights, and guides on long-term floral planning, personal growth, and making sure you never forget the important stuff.",
    path: "/articles",
  },
  "/articles/best-flower-subscription-services-us": {
    title:
      "The Best Flower Subscription Services in the United States (2026 Guide) | FutureFlower",
    description:
      "An in-depth guide to the best flower subscription services in the US, broken down by best overall, cheapest, and highest quality.",
    path: "/articles/best-flower-subscription-services-us",
    ogType: "article",
    ogImage: "/static/og-images/og-flower-subscription-us.webp",
  },
  "/articles/best-flower-subscription-services-au": {
    title:
      "The Best Flower Subscription Services in Australia (2026 Guide) | FutureFlower",
    description:
      "An in-depth guide to the best flower subscription services in Australia, broken down by best overall, cheapest, and highest quality.",
    path: "/articles/best-flower-subscription-services-au",
    ogType: "article",
  },
  "/articles/best-flower-subscription-services-uk": {
    title:
      "The Best Flower Subscription Services in the United Kingdom (2026 Guide) | FutureFlower",
    description:
      "An in-depth guide to the best flower subscription services in the UK, broken down by best overall, cheapest, and highest quality.",
    path: "/articles/best-flower-subscription-services-uk",
    ogType: "article",
  },
  "/articles/best-flower-subscription-services-eu": {
    title:
      "The Best Flower Subscription Services in Europe (2026 Guide) | FutureFlower",
    description:
      "A guide to the best flower subscription services in Europe, covering overall experience, budget options, and high-quality bouquets.",
    path: "/articles/best-flower-subscription-services-eu",
    ogType: "article",
  },
  "/articles/best-flower-subscription-services-nz": {
    title:
      "The Best Flower Subscription Services in New Zealand (2026 Guide) | FutureFlower",
    description:
      "An in-depth guide to the best flower subscription services in NZ, broken down by best overall, cheapest, and highest quality.",
    path: "/articles/best-flower-subscription-services-nz",
    ogType: "article",
  },
  "/articles/best-flower-delivery-perth": {
    title: "The Best Flower Delivery Services in Perth (2026 Guide) | FutureFlower",
    description:
      "An in-depth guide to the best flower delivery services in Perth, broken down by best overall, fastest, and most affordable.",
    path: "/articles/best-flower-delivery-perth",
    ogType: "article",
  },
  "/articles/best-flower-delivery-sydney": {
    title: "The Best Flower Delivery Services in Sydney (2026 Guide) | FutureFlower",
    description:
      "An in-depth guide to the best flower delivery services in Sydney, organized by best overall, fastest delivery, and most affordable.",
    path: "/articles/best-flower-delivery-sydney",
    ogType: "article",
  },
  "/articles/best-flower-delivery-adelaide": {
    title:
      "The Best Flower Delivery Services in Adelaide (2026 Guide) | FutureFlower",
    description:
      "A complete look at the top flower delivery services in Adelaide, tailored for quality, speed, and price.",
    path: "/articles/best-flower-delivery-adelaide",
    ogType: "article",
    ogImage: "/static/og-images/og-flower-delivery-adelaide.webp",
  },
  "/articles/best-flower-delivery-darwin": {
    title: "The Best Flower Delivery Services in Darwin (2026 Guide) | FutureFlower",
    description:
      "A complete guide to the top flower delivery services serving Darwin - broken down by best overall, fastest delivery, and most affordable options.",
    path: "/articles/best-flower-delivery-darwin",
    ogType: "article",
  },
  "/articles/best-flower-delivery-melbourne": {
    title:
      "The Best Flower Delivery Services in Melbourne (2026 Guide) | FutureFlower",
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
  "/subscribe-flow",
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
