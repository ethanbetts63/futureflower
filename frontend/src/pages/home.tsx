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


const HomePage = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FutureFlower",
    "url": "https://www.futureflower.app",
    "logo": "https://www.futureflower.app/favicon-192x192.png",
    "description": "Online flower delivery and subscription service connecting customers with local florists across Australia, the UK, the US, New Zealand, and Europe.",
    "areaServed": [
      { "@type": "Country", "name": "Australia" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "New Zealand" },
      { "@type": "Continent", "name": "Europe" }
    ],
    "sameAs": [
      "https://www.instagram.com/futureflowerapp/"
      // Add Facebook page URL here once created
      // Add X (Twitter) profile URL here once created
      // Add LinkedIn company page URL here once created
    ],
    "founder": {
      "@type": "Person",
      "name": "Ethan Betts"
    }
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

  const homeFaqs: FaqItem[] = [
    {
      "question": "Will I get reminders or confirmations?",
      "answer": "You will receive a reminder email 1 week and 1 day before the delivery date. They are not confirmation emails so you do not need to respond. They are simply to remind you."
    },
    {
      "question": "What is your refund policy?",
      "answer": "All orders are 100% refundable up to 14 days before your delivery date, after that point we can not guarantee a refund but we will try our utmost. If your flowers arrive with a major issue (e.g. damaged, dead) this is of course enough reason for a refund. For more information please read the customer terms and conditions."
    },
    {
      "question": "What countries do you operate in?",
      "answer": "Currently we operate in the EU (Europe), United Kingdom, North America (USA & Canada), Australia and New Zealand."
    },
  ];

  return (
    <main>
      <Seo
        title="FutureFlower | Flower Delivery & Subscriptions"
        description="Personalized, fresh flowers. Get free delivery, and support local florists. Pick a date, pick a budget, and we handle the rest. More flowers, less hassle."
        canonicalPath="/"
        ogImage="/og-images/og-homepage.webp"
        structuredData={organizationSchema}
      />
      <HeroV2
        title={<>The gift that <span className='italic'>keeps</span> on giving.</>}
        subtext="Pick a date. Pick a budget. We handle the rest. More flowers, less hassle."
      />
      <AnnouncementBar />

      {/* --- Hierarchy Section --- */}
      <section className="bg-primary">
        <ProductCarousel
          title="How It Works"
          subtitle="Meaningful flowers on meaningful dates, minus the effort. One decision, no hassle."
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