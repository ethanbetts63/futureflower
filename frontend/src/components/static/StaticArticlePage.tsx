import Link from "next/link";
import type { ArticleContent } from "@/lib/staticPages";

export function StaticArticlePage({ article }: { article: ArticleContent }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.futureflower.app/articles/${article.slug}`,
    },
    author: {
      "@type": "Organization",
      name: "FutureFlower",
    },
    publisher: {
      "@type": "Organization",
      name: "FutureFlower",
    },
  };

  return (
    <main className="bg-primary text-primary-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container mx-auto max-w-4xl px-4 py-16">
        <Link href="/articles" className="text-sm font-bold uppercase tracking-widest text-black underline">
          Articles
        </Link>
        <h1 className="mt-6 text-4xl font-bold leading-tight text-black md:text-6xl">
          {article.title}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-black/70">
          {article.description}
        </p>
        <div className="mt-10 space-y-8 text-lg leading-relaxed text-black">
          {article.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-3xl font-bold text-black">{section.title}</h2>
              <p className="mt-3">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
