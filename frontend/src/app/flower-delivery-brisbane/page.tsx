import FlowerDeliveryBrisbane from "@/app/flower-delivery-brisbane/FlowerDeliveryBrisbane";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/flower-delivery-brisbane");

export default function Page() {
  return <FlowerDeliveryBrisbane />;
}
