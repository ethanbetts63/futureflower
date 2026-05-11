import { StaticMarketingPage } from "@/components/static/StaticMarketingPage";
import { getRouteMetadata } from "@/lib/routeMetadata";
import { landingPages } from "@/lib/staticPages";

export const metadata = getRouteMetadata("/affiliates");

export default function AffiliatesPage() {
  return <StaticMarketingPage page={landingPages["/affiliates"]} />;
}
