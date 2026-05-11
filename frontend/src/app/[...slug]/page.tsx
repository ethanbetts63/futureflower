import LegacyAppShell from "@/app_components/LegacyAppShell";
import { getPathFromSlug, getRouteMetadata } from "@/lib/routeMetadata";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getRouteMetadata(getPathFromSlug(slug));
}

export default function Page() {
  return <LegacyAppShell />;
}
