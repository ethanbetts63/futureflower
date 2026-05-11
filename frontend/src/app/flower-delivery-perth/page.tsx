import FlowerDeliveryPerth from "@/page_components/FlowerDeliveryPerth";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/flower-delivery-perth");

export default function Page() {
  return <FlowerDeliveryPerth />;
}
