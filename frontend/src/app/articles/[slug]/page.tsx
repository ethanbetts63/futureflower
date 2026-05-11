import { StaticArticlePage } from "@/components/static/StaticArticlePage";
import { articleMap, articles } from "@/lib/staticPages";
import { getRouteMetadata } from "@/lib/routeMetadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getRouteMetadata(`/articles/${slug}`);
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = articleMap[slug];

  if (!article) {
    notFound();
  }

  return <StaticArticlePage article={article} />;
}
