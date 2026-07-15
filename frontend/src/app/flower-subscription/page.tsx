import FlowerSubscription from "@/page_components/FlowerSubscription";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/flower-subscription");

export default function Page() {
  return <FlowerSubscription />;
}
