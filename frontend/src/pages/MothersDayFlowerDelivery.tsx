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

const MothersDayFlowerDelivery = () => {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Mother's Day Flower Delivery",
    "name": "Mother's Day Flower Delivery by FutureFlower",
    "description": "Fresh Mother's Day flowers from local florists. Schedule ahead and never leave it to the last minute.",
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

  const mothersDayFaqs: FaqItem[] = [
    {
      question: "When is Mother's Day in Australia?",
      answer: "Mother's Day in Australia falls on the second Sunday in May. In the UK it falls in March, and in the US in May. FutureFlower supports scheduling across all regions."
    },
    {
      question: "Can I schedule Mother's Day flower delivery in advance?",
      answer: "Yes — you can schedule Mother's Day deliveries months in advance. You'll receive a reminder email 1 week and 1 day before the date, and a local florist handles everything on the day."
    },
    {
      question: "What flowers are popular for Mother's Day?",
      answer: "Soft, feminine arrangements are popular — peonies, roses, lilies, and mixed pastel bouquets. Our florists design custom arrangements based on your preferences and budget."
    },
    {
      question: "Is Mother's Day flower delivery available across Australia?",
      answer: "We operate across Australia, the UK, the US, New Zealand, and Europe. Local florists in each region handle the arrangement and delivery so the flowers are always fresh."
    }
  ];

  return (
    <main>
      <Seo
        title="Mother's Day Flower Delivery | FutureFlower"
        description="Send fresh Mother's Day flowers from local florists. Schedule ahead to guarantee delivery — free across Australia, the UK, the US, and more."
        canonicalPath="/mothers-day-flower-delivery"
        ogImage="/og-images/og-mothers-day-flowers.webp"
        structuredData={serviceSchema}
      />
      <HeroV2
        title="Mother's Day Flower Delivery"
        subtext="Fresh flowers from local florists, delivered on the day. Schedule months ahead and never leave it to the last minute."
      />
      <AnnouncementBar />

      <section className="bg-primary">
        <ProductCarousel
          title="How It Works"
          subtitle="Pick the date, set a budget, and a local florist takes care of the rest. No last-minute stress."
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
            title="Mother's Day flowers — answered."
            faqs={mothersDayFaqs}
          />
        </section>
      </div>

      <ArticleCarousel />
    </main>
  );
};

export default MothersDayFlowerDelivery;
