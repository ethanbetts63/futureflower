import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const routes: Array<{ path: string; lastModified: string }> = [
  { path: "/", lastModified: "2026-05-11" },
  { path: "/florists", lastModified: "2026-05-11" },
  { path: "/affiliates", lastModified: "2026-05-11" },
  { path: "/pricing", lastModified: "2026-05-11" },
  { path: "/flower-subscription", lastModified: "2026-07-15" },
  { path: "/articles", lastModified: "2026-05-23" },
  { path: "/articles/best-flower-subscription-services-au", lastModified: "2026-05-23" },
  { path: "/articles/best-flower-delivery-perth", lastModified: "2026-05-23" },
  { path: "/articles/best-flower-delivery-sydney", lastModified: "2026-05-23" },
  { path: "/articles/best-flower-delivery-adelaide", lastModified: "2026-05-23" },
  { path: "/articles/best-flower-delivery-darwin", lastModified: "2026-05-23" },
  { path: "/articles/best-flower-delivery-melbourne", lastModified: "2026-05-23" },
  { path: "/birthday-flower-delivery", lastModified: "2026-05-11" },
  { path: "/valentines-day-flower-delivery", lastModified: "2026-05-11" },
  { path: "/mothers-day-flower-delivery", lastModified: "2026-05-11" },
  { path: "/flower-delivery-perth", lastModified: "2026-05-11" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: route.lastModified,
  }));
}
