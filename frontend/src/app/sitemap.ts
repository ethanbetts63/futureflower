import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Listed by hand so `lastModified` is a deliberate "date we last changed this page"
// signal, set per URL — not derived from anything else.
const routes: Array<{ path: string; lastModified: string }> = [
  { path: "/", lastModified: "2026-07-20" },
  { path: "/florists", lastModified: "2026-07-20" },
  { path: "/affiliates", lastModified: "2026-07-20" },
  { path: "/pricing", lastModified: "2026-07-20" },
  { path: "/flower-subscription", lastModified: "2026-07-20" },
  { path: "/corporate-flower-subscriptions", lastModified: "2026-07-23" },
  { path: "/send-flowers-to-australia-from-overseas", lastModified: "2026-07-23" },
  { path: "/articles", lastModified: "2026-07-20" },
  { path: "/articles/best-flower-subscription-services-au", lastModified: "2026-07-20" },
  { path: "/articles/best-flower-delivery-perth", lastModified: "2026-07-20" },
  { path: "/articles/best-flower-delivery-sydney", lastModified: "2026-07-20" },
  { path: "/articles/best-flower-delivery-adelaide", lastModified: "2026-07-20" },
  { path: "/articles/best-flower-delivery-darwin", lastModified: "2026-07-20" },
  { path: "/articles/best-flower-delivery-melbourne", lastModified: "2026-07-20" },
  { path: "/birthday-flower-delivery", lastModified: "2026-07-20" },
  { path: "/valentines-day-flower-delivery", lastModified: "2026-07-20" },
  { path: "/mothers-day-flower-delivery", lastModified: "2026-07-20" },
  { path: "/flower-delivery-perth", lastModified: "2026-07-20" },
  { path: "/flower-delivery-melbourne", lastModified: "2026-07-20" },
  { path: "/flower-delivery-sydney", lastModified: "2026-07-20" },
  { path: "/flower-delivery-brisbane", lastModified: "2026-07-20" },
  { path: "/flower-delivery-adelaide", lastModified: "2026-07-20" },
  { path: "/flower-delivery-hobart", lastModified: "2026-07-20" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: route.lastModified,
  }));
}
