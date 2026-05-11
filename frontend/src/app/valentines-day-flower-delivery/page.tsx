import { StaticMarketingPage } from "@/components/static/StaticMarketingPage";
import { getRouteMetadata } from "@/lib/routeMetadata";
import { landingPages } from "@/lib/staticPages";

export const metadata = getRouteMetadata("/valentines-day-flower-delivery");

export default function ValentinesDayFlowerDeliveryPage() {
  return <StaticMarketingPage page={landingPages["/valentines-day-flower-delivery"]} />;
}
