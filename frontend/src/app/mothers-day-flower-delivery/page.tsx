import MothersDayFlowerDelivery from "@/page_components/MothersDayFlowerDelivery";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/mothers-day-flower-delivery");

export default function Page() {
  return <MothersDayFlowerDelivery />;
}
