import FlowerDeliveryMelbourne from "@/app/flower-delivery-melbourne/FlowerDeliveryMelbourne";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/flower-delivery-melbourne");

export default function Page() {
  return <FlowerDeliveryMelbourne />;
}
