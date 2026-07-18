import FlowerSubscription from "@/app/flower-subscription/FlowerSubscription";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/flower-subscription");

export default function Page() {
  return <FlowerSubscription />;
}
