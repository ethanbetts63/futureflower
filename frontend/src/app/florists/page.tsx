import FloristsPage from "@/page_components/FloristsPage";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/florists");

export default function Page() {
  return <FloristsPage />;
}
