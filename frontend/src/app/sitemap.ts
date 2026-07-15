import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { ARTICLES } from "@/lib/articles";

const staticRoutes: Array<{ path: string; lastModified: string }> = [
  { path: "/", lastModified: "2026-05-11" },
  { path: "/florists", lastModified: "2026-05-11" },
  { path: "/affiliates", lastModified: "2026-05-11" },
  { path: "/pricing", lastModified: "2026-05-11" },
  { path: "/flower-subscription", lastModified: "2026-07-15" },
  { path: "/articles", lastModified: "2026-05-23" },
  { path: "/birthday-flower-delivery", lastModified: "2026-05-11" },
  { path: "/valentines-day-flower-delivery", lastModified: "2026-05-11" },
  { path: "/mothers-day-flower-delivery", lastModified: "2026-05-11" },
  { path: "/flower-delivery-perth", lastModified: "2026-05-11" },
];

// Article URLs are derived from the single article registry (lib/articles.ts).
const articleRoutes = ARTICLES.map((article) => ({
  path: `/articles/${article.slug}`,
  lastModified: article.dateModified.slice(0, 10),
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...articleRoutes].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: route.lastModified,
  }));
}
