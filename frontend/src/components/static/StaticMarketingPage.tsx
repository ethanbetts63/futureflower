import Link from "next/link";
import type { LandingPageContent } from "@/lib/staticPages";

export function StaticMarketingPage({ page }: { page: LandingPageContent }) {
  return (
    <main>
      <section className="bg-[var(--color4)] px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/60">
          {page.eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold leading-tight text-black md:text-6xl">
          {page.title}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-black/70">
          {page.intro}
        </p>
        <Link
          href={page.ctaHref}
          className="mt-8 inline-flex bg-[var(--colorgreen)] px-6 py-4 text-sm font-bold uppercase tracking-widest text-black"
        >
          {page.ctaLabel}
        </Link>
      </section>
      <section className="bg-white py-12">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-black">{section.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-black/70">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
