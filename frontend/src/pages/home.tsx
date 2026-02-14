import Seo from '../components/Seo';
import { ProductCarousel } from '../components/ProductCarousel';
import { FaqV2 } from '../components/FaqV2';
import { HeroV2 } from '../components/HeroV2';
import { DeliverySection } from '../components/DeliverySection';
import { RomanceSection } from '../components/RomanceSection';
import type { FaqItem } from '@/types/FaqItem';
import { ArticleCarousel } from '../components/ArticleCarousel';
import AnnouncementBar from '../components/AnnouncementBar';
import OfferingSection from '../components/OfferingSection';
import ComparisonSection from '../components/ComparisonSection';


const HomePage = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FutureFlower",
    "url": "https://www.futureflower.app",
    "logo": "https://www.futureflower.app/favicon.ico",
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
      "question": "What countries do you operate in?",
      "answer": "Currently we operate in the EU (Europe), United Kingdom, North America (USA & Canada), Australia and New Zealand."
    },
  ];

  return (
    <main>
      <Seo
        title="FutureFlower | Flower Subscription Service"
        description="The most romantic gestures are those that plan for a future together. Choose the dates, set the budget, and we organize flower deliveries, time after time - turning one decision into a lifetime of meaningful moments."
        canonicalPath="/"
        ogImage="/og-images/og-homepage.webp"
        structuredData={organizationSchema}
      />
      <HeroV2
        title={<>The gift that <span className='italic'>keeps</span> on giving.</>}
      />
      <AnnouncementBar />

      {/* --- Hierarchy Section --- */}
      <section className="bg-primary">
        <ProductCarousel />
      </section>

      <OfferingSection />

      <ComparisonSection />

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