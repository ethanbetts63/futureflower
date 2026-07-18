import HomePage from "@/app/HomePage";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/");

export default function Page() {
  return <HomePage />;
}
