import PricingPage from "@/app/pricing/PricingPage";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/pricing");

export default function Page() {
  return <PricingPage />;
}
