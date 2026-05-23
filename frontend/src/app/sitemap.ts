import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futureflower.app";

const routes: Array<{ path: string; lastModified: string }> = [
  { path: "/", lastModified: "2026-05-11" },
  { path: "/contact", lastModified: "2026-05-13" },
  { path: "/florists", lastModified: "2026-05-11" },
  { path: "/affiliates", lastModified: "2026-05-11" },
  { path: "/pricing", lastModified: "2026-05-11" },
  { path: "/articles", lastModified: "2026-05-11" },
  { path: "/articles/best-flower-subscription-services-us", lastModified: "2026-02-25" },
  { path: "/articles/best-flower-subscription-services-au", lastModified: "2026-02-25" },
  { path: "/articles/best-flower-subscription-services-uk", lastModified: "2026-02-25" },
  { path: "/articles/best-flower-subscription-services-eu", lastModified: "2026-02-25" },
  { path: "/articles/best-flower-subscription-services-nz", lastModified: "2026-02-25" },
  { path: "/articles/best-flower-delivery-perth", lastModified: "2026-02-25" },
  { path: "/articles/best-flower-delivery-sydney", lastModified: "2026-02-25" },
  { path: "/articles/best-flower-delivery-adelaide", lastModified: "2026-02-25" },
  { path: "/articles/best-flower-delivery-darwin", lastModified: "2026-02-25" },
  { path: "/articles/best-flower-delivery-melbourne", lastModified: "2026-02-25" },
  { path: "/birthday-flower-delivery", lastModified: "2026-05-11" },
  { path: "/valentines-day-flower-delivery", lastModified: "2026-05-11" },
  { path: "/mothers-day-flower-delivery", lastModified: "2026-05-11" },
  { path: "/flower-delivery-perth", lastModified: "2026-05-11" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: route.lastModified,
  }));
}
