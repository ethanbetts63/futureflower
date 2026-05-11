import ContactPage from "@/page_components/ContactPage";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/contact");

export default function Page() {
  return <ContactPage />;
}
