import AffiliatesPage from "@/app/affiliates/AffiliatesPage";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/affiliates");

export default function Page() {
  return <AffiliatesPage />;
}
