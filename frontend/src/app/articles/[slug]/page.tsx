import BestFlowerDeliveryAdelaide from "@/page_components/articles/BestFlowerDeliveryAdelaide";
import BestFlowerDeliveryDarwin from "@/page_components/articles/BestFlowerDeliveryDarwin";
import BestFlowerDeliveryMelbourne from "@/page_components/articles/BestFlowerDeliveryMelbourne";
import BestFlowerDeliveryPerth from "@/page_components/articles/BestFlowerDeliveryPerth";
import BestFlowerDeliverySydney from "@/page_components/articles/BestFlowerDeliverySydney";
import BestFlowerSubscriptionServicesAU from "@/page_components/articles/BestFlowerSubscriptionServicesAU";
import { ARTICLES } from "@/lib/articles";
import { getRouteMetadata } from "@/lib/routeMetadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const articleComponents: Record<string, ComponentType> = {
  "best-flower-subscription-services-au": BestFlowerSubscriptionServicesAU,
  "best-flower-delivery-perth": BestFlowerDeliveryPerth,
  "best-flower-delivery-sydney": BestFlowerDeliverySydney,
  "best-flower-delivery-adelaide": BestFlowerDeliveryAdelaide,
  "best-flower-delivery-darwin": BestFlowerDeliveryDarwin,
  "best-flower-delivery-melbourne": BestFlowerDeliveryMelbourne,
};

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
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
  const ArticleComponent = articleComponents[slug];

  if (!ArticleComponent) {
    notFound();
  }

  return <ArticleComponent />;
}
