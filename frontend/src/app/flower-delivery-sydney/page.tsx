import FlowerDeliverySydney from "@/app/flower-delivery-sydney/FlowerDeliverySydney";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/flower-delivery-sydney");

export default function Page() {
  return <FlowerDeliverySydney />;
}
