import { StaticMarketingPage } from "@/components/static/StaticMarketingPage";
import { getRouteMetadata } from "@/lib/routeMetadata";
import { landingPages } from "@/lib/staticPages";

export const metadata = getRouteMetadata("/mothers-day-flower-delivery");

export default function MothersDayFlowerDeliveryPage() {
  return <StaticMarketingPage page={landingPages["/mothers-day-flower-delivery"]} />;
}
