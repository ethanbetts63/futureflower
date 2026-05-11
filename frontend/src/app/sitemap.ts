import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futureflower.app";

const routes = [
  "/",
  "/contact",
  "/florists",
  "/affiliates",
  "/pricing",
  "/articles",
  "/articles/best-flower-subscription-services-us",
  "/articles/best-flower-subscription-services-au",
  "/articles/best-flower-subscription-services-uk",
  "/articles/best-flower-subscription-services-eu",
  "/articles/best-flower-subscription-services-nz",
  "/articles/best-flower-delivery-perth",
  "/articles/best-flower-delivery-sydney",
  "/articles/best-flower-delivery-adelaide",
  "/articles/best-flower-delivery-darwin",
  "/articles/best-flower-delivery-melbourne",
  "/birthday-flower-delivery",
  "/valentines-day-flower-delivery",
  "/mothers-day-flower-delivery",
  "/flower-delivery-perth",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "/" || route === "/articles" ? "weekly" : "monthly",
    priority:
      route === "/"
        ? 1
        : [
            "/articles",
            "/birthday-flower-delivery",
            "/valentines-day-flower-delivery",
            "/mothers-day-flower-delivery",
            "/flower-delivery-perth",
          ].includes(route)
          ? 0.8
          : 0.7,
  }));
}
