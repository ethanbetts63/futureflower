import FlowerDeliveryHobart from "@/app/flower-delivery-hobart/FlowerDeliveryHobart";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/flower-delivery-hobart");

export default function Page() {
  return <FlowerDeliveryHobart />;
}
