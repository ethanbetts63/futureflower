import MothersDayFlowerDelivery from "@/app/mothers-day-flower-delivery/MothersDayFlowerDelivery";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/mothers-day-flower-delivery");

export default function Page() {
  return <MothersDayFlowerDelivery />;
}
