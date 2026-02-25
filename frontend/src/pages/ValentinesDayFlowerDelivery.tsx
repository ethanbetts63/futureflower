import Seo from '../components/Seo';
import { ProductCarousel } from '../components/ProductCarousel';
import type { ProductCarouselStep } from '../components/ProductCarousel';
import petalImage320 from '../assets/petal-320w.webp';
import petalImage640 from '../assets/petal-640w.webp';
import petalImage768 from '../assets/petal-768w.webp';
import petalImage1024 from '../assets/petal-1024w.webp';
import petalImage1280 from '../assets/petal-1280w.webp';

import floristMakingFlowersImage320 from '../assets/florist_making_flowers-320w.webp';
import floristMakingFlowersImage640 from '../assets/florist_making_flowers-640w.webp';
import floristMakingFlowersImage768 from '../assets/florist_making_flowers-768w.webp';
import floristMakingFlowersImage1024 from '../assets/florist_making_flowers-1024w.webp';
import floristMakingFlowersImage1280 from '../assets/florist_making_flowers-1280w.webp';

import deliveryImage320 from '../assets/delivery-320w.webp';
import deliveryImage360 from '../assets/delivery-360w.webp';
import deliveryImage640 from '../assets/delivery-640w.webp';
import deliveryImage768 from '../assets/delivery-768w.webp';
import deliveryImage1024 from '../assets/delivery-1024w.webp';
import deliveryImage1280 from '../assets/delivery-1280w.webp';

import { FaqV2 } from '../components/FaqV2';
import { HeroV2 } from '../components/home_page/HeroV2';
import { DeliverySection } from '../components/home_page/DeliverySection';
import { RomanceSection } from '../components/home_page/RomanceSection';
import type { FaqItem } from '@/types/FaqItem';
import { ArticleCarousel } from '../components/home_page/ArticleCarousel';
import AnnouncementBar from '../components/home_page/AnnouncementBar';
import OfferingSection from '../components/home_page/OfferingSection';
import ComparisonSection from '../components/home_page/ComparisonSectionHome';

const ValentinesDayFlowerDelivery = () => {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Valentine's Day Flower Delivery",
    "name": "Valentine's Day Flower Delivery by FutureFlower",
    "description": "Fresh Valentine's Day flowers from local florists. Schedule your order months ahead and skip the last-minute rush.",
    "provider": {
      "@type": "Organization",
      "name": "FutureFlower",
      "url": "https://www.futureflower.app"
    },
    "areaServed": [
      { "@type": "Country", "name": "Australia" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "New Zealand" },
      { "@type": "Continent", "name": "Europe" }
    ]
  };

  const howItWorksSteps: ProductCarouselStep[] = [
    {
      level: 1,
      title: 'Choose the Vibe.',
      description:
        'Birthday. Romantic. Sympathy. Celebration. Just because. We design around your preferences.',
      image: {
        src: petalImage1280,
        srcSet: `${petalImage320} 320w, ${petalImage640} 640w, ${petalImage768} 768w, ${petalImage1024} 1024w, ${petalImage1280} 1280w`,
        sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
        alt: 'Petal image for choosing the vibe',
      },
    },
    {
      level: 2,
      title: 'Choose the Impact.',
      description:
        'A thoughtful gesture. A classic arrangement. A statement piece. You set the budget — our florists design accordingly.',
      image: {
        src: floristMakingFlowersImage1280,
        srcSet: `${floristMakingFlowersImage320} 320w, ${floristMakingFlowersImage640} 640w, ${floristMakingFlowersImage768} 768w, ${floristMakingFlowersImage1024} 1024w, ${floristMakingFlowersImage1280} 1280w`,
        sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
        alt: 'Florist making flowers image for choosing the impact',
      },
    },
    {
      level: 3,
      title: 'We handle the rest.',
      description:
        'A local florist creates something unique and beautiful. No catalog copies. No warehouse stock. Just real floristry.',
      image: {
        src: deliveryImage1280,
        srcSet: `${deliveryImage320} 320w, ${deliveryImage360} 360w, ${deliveryImage640} 640w, ${deliveryImage768} 768w, ${deliveryImage1024} 1024w, ${deliveryImage1280} 1280w`,
        sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
        alt: 'Delivery image for handling the rest',
      },
    },
  ];

  const valentinesFaqs: FaqItem[] = [
    {
      question: "When should I order flowers for Valentine's Day?",
      answer: "Most florists are overwhelmed with last-minute orders on February 14. Ordering weeks or months in advance guarantees your delivery and gives the florist more time to craft a better arrangement."
    },
    {
      question: "Can I schedule Valentine's Day flower delivery in advance?",
      answer: "Yes — FutureFlower is built for scheduling ahead. Pick February 14, set your budget, and the order is locked in. You'll receive a reminder email 1 week and 1 day before the date."
    },
    {
      question: "What flowers are best for Valentine's Day?",
      answer: "Red roses are the classic choice, but many people opt for mixed arrangements including tulips, peonies, or lisianthus. Our local florists design custom arrangements based on your preferences and budget."
    },
    {
      question: "Is Valentine's Day flower delivery available in Australia?",
      answer: "We operate across Australia, the UK, the US, New Zealand, and Europe. Local florists in each region handle the arrangement and delivery so the flowers are always fresh."
    }
  ];

  return (
    <main>
      <Seo
        title="Valentine's Day Flower Delivery | FutureFlower"
        description="Send fresh Valentine's Day flowers from local florists. Schedule your order months ahead — free delivery across Australia, the UK, the US, and more."
        canonicalPath="/valentines-day-flower-delivery"
        ogImage="/og-images/og-valentines-flowers.webp"
        structuredData={serviceSchema}
      />
      <HeroV2
        title="Valentine's Day Flower Delivery"
        subtext="Fresh flowers from local florists for the one that matters most. Order months ahead and skip the Valentine's Day rush."
      />
      <AnnouncementBar />

      <section className="bg-primary">
        <ProductCarousel
          title="How It Works"
          subtitle="Pick February 14, set a budget, and a local florist takes care of the rest. No last-minute panic."
          steps={howItWorksSteps}
        />
      </section>

      <OfferingSection />

      <ComparisonSection />

      <RomanceSection />
      <DeliverySection />

      <div className="bg-[var(--color4)]">
        <section className="pb-8">
          <FaqV2
            title="Valentine's Day flowers — answered."
            faqs={valentinesFaqs}
          />
        </section>
      </div>

      <ArticleCarousel />
    </main>
  );
};

export default ValentinesDayFlowerDelivery;
