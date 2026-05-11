import Link from "next/link";
import { ProductCarousel } from "@/components/ProductCarousel";
import PricingFloristAdvantage from "@/components/pricing_page/PricingFloristAdvantage";
import { RomanceSection } from "@/components/home_page/RomanceSection";
import { DeliverySection } from "@/components/home_page/DeliverySection";
import { assetSrc } from "@/lib/assets";
import { getRouteMetadata } from "@/lib/routeMetadata";
import type { ProductCarouselStep } from "@/components/ProductCarousel";

import heroImage320 from "@/assets/hero2-320w.webp";
import heroImage640 from "@/assets/hero2-640w.webp";
import heroImage768 from "@/assets/hero2-768w.webp";
import heroImage1024 from "@/assets/hero2-1024w.webp";
import heroImage1280 from "@/assets/hero2-1280w.webp";
import heroMobileImage320 from "@/assets/hero2_mobile2-320w.webp";
import heroMobileImage412 from "@/assets/hero2_mobile2-412w.webp";
import heroMobileImage640 from "@/assets/hero2_mobile2-640w.webp";
import heroMobileImage768 from "@/assets/hero2_mobile2-768w.webp";
import petalImage320 from "@/assets/petal-320w.webp";
import petalImage640 from "@/assets/petal-640w.webp";
import petalImage768 from "@/assets/petal-768w.webp";
import petalImage1024 from "@/assets/petal-1024w.webp";
import petalImage1280 from "@/assets/petal-1280w.webp";
import floristMakingFlowersImage320 from "@/assets/florist_making_flowers-320w.webp";
import floristMakingFlowersImage640 from "@/assets/florist_making_flowers-640w.webp";
import floristMakingFlowersImage768 from "@/assets/florist_making_flowers-768w.webp";
import floristMakingFlowersImage1024 from "@/assets/florist_making_flowers-1024w.webp";
import floristMakingFlowersImage1280 from "@/assets/florist_making_flowers-1280w.webp";
import deliveryImage320 from "@/assets/delivery-320w.webp";
import deliveryImage360 from "@/assets/delivery-360w.webp";
import deliveryImage640 from "@/assets/delivery-640w.webp";
import deliveryImage768 from "@/assets/delivery-768w.webp";
import deliveryImage1024 from "@/assets/delivery-1024w.webp";
import deliveryImage1280 from "@/assets/delivery-1280w.webp";
import logo from "@/assets/logo.webp";

export const metadata = getRouteMetadata("/");

const howItWorksSteps: ProductCarouselStep[] = [
  {
    level: 1,
    title: "Choose the Vibe.",
    description:
      "Birthday. Romantic. Sympathy. Celebration. Just because. We design around your preferences.",
    image: {
      src: assetSrc(petalImage1280),
      srcSet: `${assetSrc(petalImage320)} 320w, ${assetSrc(petalImage640)} 640w, ${assetSrc(petalImage768)} 768w, ${assetSrc(petalImage1024)} 1024w, ${assetSrc(petalImage1280)} 1280w`,
      sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
      alt: "Petal image for choosing the vibe",
    },
  },
  {
    level: 2,
    title: "Choose the Impact.",
    description:
      "A thoughtful gesture. A classic arrangement. A statement piece. You set the budget and our florists design accordingly.",
    image: {
      src: assetSrc(floristMakingFlowersImage1280),
      srcSet: `${assetSrc(floristMakingFlowersImage320)} 320w, ${assetSrc(floristMakingFlowersImage640)} 640w, ${assetSrc(floristMakingFlowersImage768)} 768w, ${assetSrc(floristMakingFlowersImage1024)} 1024w, ${assetSrc(floristMakingFlowersImage1280)} 1280w`,
      sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
      alt: "Florist making flowers image for choosing the impact",
    },
  },
  {
    level: 3,
    title: "We handle the rest.",
    description:
      "A local florist creates something unique and beautiful. No catalog copies. No warehouse stock. Just real floristry.",
    image: {
      src: assetSrc(deliveryImage1280),
      srcSet: `${assetSrc(deliveryImage320)} 320w, ${assetSrc(deliveryImage360)} 360w, ${assetSrc(deliveryImage640)} 640w, ${assetSrc(deliveryImage768)} 768w, ${assetSrc(deliveryImage1024)} 1024w, ${assetSrc(deliveryImage1280)} 1280w`,
      sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
      alt: "Delivery image for handling the rest",
    },
  },
];

const faqs = [
  {
    question: "Will I get reminders or confirmations?",
    answer:
      "You will receive a reminder email 1 week and 1 day before the delivery date. They are not confirmation emails, so you do not need to respond.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "All orders are fully refundable up to 14 days before your delivery date. After that point we cannot guarantee a refund, but we will try our utmost.",
  },
  {
    question: "What countries do you operate in?",
    answer:
      "Currently we operate in the EU, United Kingdom, North America, Australia, and New Zealand.",
  },
];

const articleLinks = [
  {
    href: "/articles/best-flower-subscription-services-us",
    title: "The Best Flower Subscription Services in the United States",
  },
  {
    href: "/articles/best-flower-subscription-services-au",
    title: "The Best Flower Subscription Services in Australia",
  },
  {
    href: "/articles/best-flower-delivery-perth",
    title: "The Best Flower Delivery Services in Perth",
  },
];

function StaticHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-black/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:grid md:grid-cols-3">
          <Link href="/" aria-label="FutureFlower company logo" className="flex items-center gap-3">
            <img
              src={assetSrc(logo)}
              alt=""
              width="40"
              height="40"
              className="h-10 w-10 object-contain brightness-0"
            />
            <span className="hidden sm:block md:hidden font-['Playfair_Display',_serif] italic font-bold text-2xl text-black tracking-widest leading-none">
              FUTUREFLOWER
            </span>
          </Link>
          <div className="hidden md:flex justify-center">
            <Link href="/" className="font-['Playfair_Display',_serif] italic font-bold text-3xl text-black tracking-widest leading-none">
              FUTUREFLOWER
            </Link>
          </div>
          <nav className="flex items-center gap-4 md:justify-end">
            <Link href="/pricing" className="text-xs font-bold text-black tracking-widest uppercase hover:text-black/50 transition-colors">
              Pricing
            </Link>
            <Link href="/order" className="inline-flex items-center bg-black text-white font-bold px-4 py-1.5 text-xs tracking-widest uppercase">
              Order
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function FaqBlock() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="bg-[var(--color4)] py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-black mb-8">
          Questions? We have answers.
        </h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-black">{faq.question}</h3>
              <p className="mt-3 text-lg text-gray-600">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleLinks() {
  return (
    <section className="w-full py-12 bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center text-primary-foreground mb-2">
          From the FutureFlower Blog
        </h2>
        <p className="text-lg text-primary-foreground text-center mb-8">
          Insights and guides for long-term floral planning.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {articleLinks.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="flex min-h-36 items-center justify-center rounded-lg bg-white p-6 text-center text-xl font-semibold text-black shadow-sm hover:underline"
            >
              {article.title}
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/articles" className="text-sm font-bold uppercase tracking-widest text-black underline">
            See more blog posts
          </Link>
        </div>
      </div>
    </section>
  );
}

function StaticFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto py-10 px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Quick Links</p>
            <Link href="/florists" className="text-sm hover:underline">Florists</Link>
            <Link href="/affiliates" className="text-sm hover:underline">Affiliates</Link>
            <Link href="/contact" className="text-sm hover:underline">Contact Us</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Flower Delivery</p>
            <Link href="/birthday-flower-delivery" className="text-sm hover:underline">Birthday Flowers</Link>
            <Link href="/valentines-day-flower-delivery" className="text-sm hover:underline">Valentine's Day Flowers</Link>
            <Link href="/mothers-day-flower-delivery" className="text-sm hover:underline">Mother's Day Flowers</Link>
            <Link href="/flower-delivery-perth" className="text-sm hover:underline">Flower Delivery Perth</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60">For Partners</p>
            <Link href="/florists" className="text-sm hover:underline">Florist Partners</Link>
            <Link href="/affiliates" className="text-sm hover:underline">Affiliates</Link>
          </div>
          <div className="flex flex-col gap-3">
            <img src={assetSrc(logo)} alt="FutureFlower Logo" className="h-16 w-16 object-contain" />
            <p className="text-sm opacity-80">&copy; 2026 FutureFlower. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FutureFlower",
    url: "https://www.futureflower.app",
    logo: "https://www.futureflower.app/favicon-192x192.png",
    description:
      "Online flower delivery and subscription service connecting customers with local florists across Australia, the UK, the US, New Zealand, and Europe.",
    founder: {
      "@type": "Person",
      name: "Ethan Betts",
    },
  };

  return (
    <>
      <StaticHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <section className="w-full">
          <div className="md:hidden flex flex-col">
            <picture className="block w-full">
              <source
                media="(max-width: 767px)"
                srcSet={`${assetSrc(heroMobileImage320)} 320w, ${assetSrc(heroMobileImage412)} 412w, ${assetSrc(heroMobileImage640)} 640w, ${assetSrc(heroMobileImage768)} 768w`}
                sizes="100vw"
              />
              <img
                src={assetSrc(heroImage1280)}
                srcSet={`${assetSrc(heroImage320)} 320w, ${assetSrc(heroImage640)} 640w, ${assetSrc(heroImage768)} 768w, ${assetSrc(heroImage1024)} 1024w, ${assetSrc(heroImage1280)} 1280w`}
                sizes="100vw"
                alt="A woman holding a large bouquet of flowers."
                className="w-full h-72 sm:h-96 object-cover object-right"
              />
            </picture>
            <div className="px-6 py-10 text-center" style={{ background: "hsl(353,70%,97%)" }}>
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-black">
                Flower Delivery & Subscriptions
              </p>
              <h1 className="mt-4 text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight text-black">
                Better Flowers. Local Florists.
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-black">
                Pick a date. Pick a budget. We handle the rest. Flower delivery and subscriptions the right way.
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <Link href="/order" className="bg-[var(--colorgreen)] px-5 py-4 font-bold text-black shadow-md">
                  Send Flowers
                </Link>
                <Link href="/pricing" className="border border-black/20 bg-white px-5 py-4 font-bold text-black">
                  See Pricing
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:flex relative overflow-hidden" style={{ minHeight: "clamp(560px, 85vh, 820px)" }}>
            <div className="shrink-0 w-1/2 flex flex-col justify-center items-center px-10 md:px-14 lg:px-20 text-center" style={{ background: "hsl(353,70%,97%)" }}>
              <p className="text-xs font-bold tracking-[0.18em] uppercase text-black">
                Flower Delivery & Subscriptions
              </p>
              <h1 className="mt-4 text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-black">
                Better Flowers. Local Florists.
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-black">
                Pick a date. Pick a budget. We handle the rest. Flower delivery and subscriptions the right way.
              </p>
              <div className="mt-7 flex gap-3 justify-center">
                <Link href="/order" className="bg-[var(--colorgreen)] px-5 py-4 font-bold text-black shadow-md">
                  Send Flowers
                </Link>
                <Link href="/pricing" className="border border-black/20 bg-white px-5 py-4 font-bold text-black">
                  See Pricing
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <picture className="absolute inset-0">
                <img
                  src={assetSrc(heroImage1280)}
                  srcSet={`${assetSrc(heroImage320)} 320w, ${assetSrc(heroImage640)} 640w, ${assetSrc(heroImage768)} 768w, ${assetSrc(heroImage1024)} 1024w, ${assetSrc(heroImage1280)} 1280w`}
                  sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 52vw, 46vw"
                  alt="A woman holding a large bouquet of flowers."
                  className="w-full h-full object-cover object-center"
                />
              </picture>
            </div>
          </div>
        </section>

        <section className="bg-primary">
          <ProductCarousel
            title="How It Works"
            subtitle="Meaningful flowers on meaningful dates, minus the effort. One decision, no hassle."
            steps={howItWorksSteps}
          />
        </section>

        <section className="bg-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-black">
              Set the occasion, budget, and date.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-black/60">
              FutureFlower gives local florists the context they need to design properly, then handles reminders, delivery coordination, and recurring plans.
            </p>
          </div>
        </section>

        <PricingFloristAdvantage />
        <RomanceSection />
        <DeliverySection />
        <FaqBlock />
        <ArticleLinks />
      </main>
      <StaticFooter />
    </>
  );
}
