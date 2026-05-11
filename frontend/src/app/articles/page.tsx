import BlogExplorePage from "@/page_components/BlogExplorePage";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/articles");

export default function Page() {
  return <BlogExplorePage />;
}
