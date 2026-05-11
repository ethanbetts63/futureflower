import ValentinesDayFlowerDelivery from "@/page_components/ValentinesDayFlowerDelivery";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/valentines-day-flower-delivery");

export default function Page() {
  return <ValentinesDayFlowerDelivery />;
}
