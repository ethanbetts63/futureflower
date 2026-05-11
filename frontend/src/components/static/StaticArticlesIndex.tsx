import Link from "next/link";
import { articles } from "@/lib/staticPages";

export function StaticArticlesIndex() {
  return (
    <main className="bg-primary text-primary-foreground">
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-black md:text-6xl">FutureFlower Blog</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-black/70">
          Guides and comparisons for flower subscriptions, flower delivery, and thoughtful long-term gifting.
        </p>
      </section>
      <section className="container mx-auto grid gap-6 px-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="rounded-lg bg-white p-6 text-black shadow-sm hover:underline"
          >
            <h2 className="text-2xl font-bold">{article.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/70">{article.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
