import HomePage from "@/page_components/home";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/");

export default function Page() {
  return <HomePage />;
}
