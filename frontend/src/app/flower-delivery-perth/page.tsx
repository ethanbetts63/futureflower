import { StaticMarketingPage } from "@/components/static/StaticMarketingPage";
import { getRouteMetadata } from "@/lib/routeMetadata";
import { landingPages } from "@/lib/staticPages";

export const metadata = getRouteMetadata("/flower-delivery-perth");

export default function FlowerDeliveryPerthPage() {
  return <StaticMarketingPage page={landingPages["/flower-delivery-perth"]} />;
}
