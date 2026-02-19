import Seo from '../components/Seo';
import { ProductCarousel } from '../components/ProductCarousel';
import type { ProductCarouselStep } from '../components/ProductCarousel';
import petalImage from '../assets/petal.png';
import floristMakingFlowersImage from '../assets/florist_making_flowers.png';
import deliveryHighImage from '../assets/delivery_high.png';
import { FaqV2 } from '../components/FaqV2';
import { HeroV2 } from '../components/home_page/HeroV2';
import { DeliverySection } from '../components/home_page/DeliverySection';
import { RomanceSection } from '../components/home_page/RomanceSection';
import type { FaqItem } from '@/types/FaqItem';
import { ArticleCarousel } from '../components/home_page/ArticleCarousel';
import AnnouncementBar from '../components/home_page/AnnouncementBar';
import deliveryIcon from '../assets/delivery_symbol.svg';
import Badge from '../components/Badge';
import OfferingSection from '../components/home_page/OfferingSection';
import ComparisonSection from '../components/home_page/ComparisonSectionHome';


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

  const howItWorksSteps: ProductCarouselStep[] = [
    {
      level: 1,
      title: 'Choose the Vibe.',
      description:
        'Birthday. Romantic. Sympathy. Celebration. Just because. We design around your preferences.',
      image: petalImage,
    },
    {
      level: 2,
      title: 'Choose the Impact.',
      description:
        'A thoughtful gesture. A classic arrangement. A statement piece. You set the budget — our florists design accordingly.',
      image: floristMakingFlowersImage,
    },
    {
      level: 3,
      title: 'We handle the rest.',
      description:
        'A local florist creates something unique and beautiful. No catalog copies. No warehouse stock. Just real floristry.',
      image: deliveryHighImage,
    },
  ];

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
      <Badge
        title="Free Delivery"
        subtext="Included on all products"
        symbol={
          <img
            src={deliveryIcon}
            alt=""
            className="h-7 w-7 animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        }
      />

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