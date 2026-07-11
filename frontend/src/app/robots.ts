import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.futureflower.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/login",
          "/forgot-password",
          "/reset-password-confirm/",
          "/dashboard",
          "/checkout",
          "/payment-status",
          "/event-gate",
          "/create-account",
          "/single-delivery-flow/",
          "/partner/stripe-connect/",
          "/partner/delivery-request/",
          "/terms-and-conditions/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
