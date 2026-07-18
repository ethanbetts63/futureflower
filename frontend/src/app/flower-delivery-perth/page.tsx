import FlowerDeliveryPerth from "@/app/flower-delivery-perth/FlowerDeliveryPerth";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/flower-delivery-perth");

export default function Page() {
  return <FlowerDeliveryPerth />;
}
