import { useRef } from 'react';
import Seo from '../components/Seo';
import { ProductCarousel } from '../components/ProductCarousel';
import { FaqV2 } from '../components/FaqV2';
import { Letter } from '../components/Letter';
import { CtaCard } from '../components/CtaCard';
import { HeroV2 } from '../components/HeroV2';
import { DeliverySection } from '../components/DeliverySection';
import { RomanceSection } from '../components/RomanceSection';
import type { FaqItem } from '@/types/FaqItem';
import { ArticleCarousel } from '../components/ArticleCarousel';


const HomePage = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ForeverFlower",
    "url": "https://www.foreverflower.app",
    "logo": "https://www.foreverflower.app/favicon.ico",
    "founder": {
      "@type": "Person",
      "name": "Ethan Betts"
    }
  };

  const homeFaqs: FaqItem[] = [
    {
      "question": "Will I get reminders or confirmations?",
      "answer": "You will receive a reminder email 1 week and 1 day before the delivery date. They are not confirmation emails so you do not need to respond. They are simply to remind you."
    },
    {
      "question": "What is your refund policy?",
      "answer": "We can’t unsend flowers. But everything up until that point is fair game."
    },
    {
      "question": "Can I increase or decrease the budget later?",
      "answer": "Yes you can. For subscriptions this is as simple as increasing the subscription amount. For upfront payment plans, by lowering the cost of each bouquet we can increase the frequency or duration of the plan. By increasing the cost of each bouquet, we can do the opposite, or you can top off the amount, to maintain or increase the quality of the bouquets."
    },
    {
      "question": "What countries do you operate in?",
      "answer": "Currently we operate in the EU (Europe), United Kingdom, North America (USA & Canada), Australia and New Zealand."
    },
    {
      "question": "Is delivery included in the price?",
      "answer": "Cost of delivery is included in your yearly flower budget. Our service fee is placed seperately on top for transparency."
    }
  ];

  return (
    <main>
      <Seo
        title="ForeverFlower | Flower Subscription Service"
        description="The most romantic gestures are those that plan for a future together. Choose the date, set the budget, and we organize flower deliveries year after year - turning one decision into a lifetime of meaningful moments."
        canonicalPath="/"
        ogImage="/og-images/og-homepage.webp"
        structuredData={organizationSchema}
      />
      <HeroV2
        title={<>The gift that <span className='italic'>keeps</span> on giving.</>}
        subtitle={<>The most romantic gestures are those that plan for a future together. Choose the date, set the budget, and we organize flower deliveries year after year - turning one decision into a lifetime of meaningful moments.</>}
        onLearnMore={() => contentRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* --- Hierarchy Section --- */}
      <section ref={contentRef} className="bg-primary">
        <ProductCarousel />
      </section>

      {/* --- Main Content & Sticky Sidebar --- */}
      <div className="bg-[var(--color4)] py-8">
        <div className="container mx-auto px-0 sm:px-4 lg:grid lg:grid-cols-3 lg:gap-8">
          
          {/* Main Content Column (2/3 width) */}
          <div className="lg:col-span-2 text-primary-foreground rounded-lg px-0 sm:p-8 md:p-8 lg:p-8 flex flex-col gap-0 sm:gap-8">
            <Letter />
            <section className="lg:hidden">
              <CtaCard />
            </section>
          </div>

          {/* Sticky Sidebar Column (1/3 width) */}
          <aside className="hidden lg:block">
            <div className="sticky mb-7 mt-6 top-24">
              <CtaCard />
            </div>
          </aside>

        </div>
      </div>


      <RomanceSection />
      <DeliverySection />
      
      <div className="bg-[var(--color4)]">
        <section className="pb-8">
          <FaqV2
            title="Questions? We have answers."
            faqs={homeFaqs}
          />
        </section>
      </div>

      <ArticleCarousel />
      
    </main>
  );
};

export default HomePage;