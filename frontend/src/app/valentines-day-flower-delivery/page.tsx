import ValentinesDayFlowerDelivery from "@/app/valentines-day-flower-delivery/ValentinesDayFlowerDelivery";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/valentines-day-flower-delivery");

export default function Page() {
  return <ValentinesDayFlowerDelivery />;
}
