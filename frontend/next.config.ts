import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from redirecting trailing-slash URLs (e.g. /api/hire/settings/)
  // to their non-slash equivalents. Without this, Next.js removes the slash, Django's
  // APPEND_SLASH adds it back, and the browser loops until ERR_TOO_MANY_REDIRECTS.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    const apiUrl = process.env.DJANGO_API_URL ?? "http://127.0.0.1:8000";

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
