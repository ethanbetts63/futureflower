import { StaticMarketingPage } from "@/components/static/StaticMarketingPage";
import { getRouteMetadata } from "@/lib/routeMetadata";
import { landingPages } from "@/lib/staticPages";

export const metadata = getRouteMetadata("/pricing");

export default function PricingPage() {
  return <StaticMarketingPage page={landingPages["/pricing"]} />;
}
