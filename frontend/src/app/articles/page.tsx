import { StaticArticlesIndex } from "@/components/static/StaticArticlesIndex";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/articles");

export default function ArticlesPage() {
  return <StaticArticlesIndex />;
}
