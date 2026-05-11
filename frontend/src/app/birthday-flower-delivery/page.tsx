import { StaticMarketingPage } from "@/components/static/StaticMarketingPage";
import { getRouteMetadata } from "@/lib/routeMetadata";
import { landingPages } from "@/lib/staticPages";

export const metadata = getRouteMetadata("/birthday-flower-delivery");

export default function BirthdayFlowerDeliveryPage() {
  return <StaticMarketingPage page={landingPages["/birthday-flower-delivery"]} />;
}
