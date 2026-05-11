import AffiliatesPage from "@/page_components/AffiliatesPage";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/affiliates");

export default function Page() {
  return <AffiliatesPage />;
}
