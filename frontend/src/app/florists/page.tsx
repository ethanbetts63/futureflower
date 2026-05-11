import { StaticMarketingPage } from "@/components/static/StaticMarketingPage";
import { getRouteMetadata } from "@/lib/routeMetadata";
import { landingPages } from "@/lib/staticPages";

export const metadata = getRouteMetadata("/florists");

export default function FloristsPage() {
  return <StaticMarketingPage page={landingPages["/florists"]} />;
}
