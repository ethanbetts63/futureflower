import FlowerDeliveryAdelaide from "@/app/flower-delivery-adelaide/FlowerDeliveryAdelaide";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/flower-delivery-adelaide");

export default function Page() {
  return <FlowerDeliveryAdelaide />;
}
