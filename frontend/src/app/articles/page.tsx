import BlogExplorePage from "@/app/articles/BlogExplorePage";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/articles");

export default function Page() {
  return <BlogExplorePage />;
}
