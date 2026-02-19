import { useRef } from 'react';
import Seo from '../components/Seo';
import { HeroAffiliatesPage } from '../components/affiliates_page/HeroAffiliatesPage';
import { ValuePropsAffiliates } from '../components/affiliates_page/ValuePropsAffiliates';
import { WhyFutureFlowerAffiliatesSection } from '../components/affiliates_page/WhyFutureFlowerAffiliatesSection';
import { ProductCarousel } from '../components/ProductCarousel';
import type { ProductCarouselStep } from '../components/ProductCarousel';
import ComparisonSectionHome from '../components/home_page/ComparisonSectionHome';
import { CommissionStructureSection } from '../components/affiliates_page/CommissionStructureSection';
import { ContentIdeasSection } from '../components/affiliates_page/ContentIdeasSection';
import petalImage from '../assets/petal.png';
import petalImage320 from '../assets/petal-320w.webp';
import petalImage640 from '../assets/petal-640w.webp';
import petalImage768 from '../assets/petal-768w.webp';
import petalImage1024 from '../assets/petal-1024w.webp';
import petalImage1280 from '../assets/petal-1280w.webp';

import floristImage from '../assets/florist.webp';
import floristImage320 from '../assets/florist-320w.webp';
import floristImage640 from '../assets/florist-640w.webp';
import floristImage768 from '../assets/florist-768w.webp';
import floristImage1024 from '../assets/florist-1024w.webp';
import floristImage1280 from '../assets/florist-1280w.webp';

import deliveryHighImage from '../assets/delivery_high.png';
import deliveryHighImage320 from '../assets/delivery_high-320w.webp';
import deliveryHighImage640 from '../assets/delivery_high-640w.webp';
import deliveryHighImage768 from '../assets/delivery_high-768w.webp';
import deliveryHighImage1024 from '../assets/delivery_high-1024w.webp';
import deliveryHighImage1280 from '../assets/delivery_high-1280w.webp';


const AffiliatesPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const affiliateHowItWorksSteps: ProductCarouselStep[] = [
    {
      level: 1,
      title: 'Grab your code.',
      description:
        'Create your account and get your custom $5 discount code (e.g., DEBRA5) in minutes.',
      image: {
        src: petalImage,
        srcSet: `${petalImage320} 320w, ${petalImage640} 640w, ${petalImage768} 768w, ${petalImage1024} 1024w, ${petalImage1280} 1280w`,
        sizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
        alt: 'Petal image for grabbing your code',
      },
    },
    {
      level: 2,
      title: 'Share the Smarter Way to Buy Flowers.',
      description:
        'Show how the same price delivers more flowers, true florist\'s choice design, and supports local florists.',
      image: {
        src: floristImage,
        srcSet: `${floristImage320} 320w, ${floristImage640} 640w, ${floristImage768} 768w, ${floristImage1024} 1024w, ${floristImage1280} 1280w`,
        sizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
        alt: 'Florist image for sharing the smarter way to buy flowers',
      },
    },
    {
      level: 3,
      title: 'Triple Dip.',
      description:
        'When a follower uses your code, you get paid for their first order, their second, and their third.',
      image: {
        src: deliveryHighImage,
        srcSet: `${deliveryHighImage320} 320w, ${deliveryHighImage640} 640w, ${deliveryHighImage768} 768w, ${deliveryHighImage1024} 1024w, ${deliveryHighImage1280} 1280w`,
        sizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
        alt: 'Delivery image for triple dipping earnings',
      },
    },
  ];

  return (
    <main>
      <Seo
        title="FutureFlower Affiliates | Earn by Gifting"
        description="Help your followers get a better deal on flower deliveries. Earn $5–$25 per delivery while giving your community $5 off their first bouquet."
        canonicalPath="/affiliates"
        ogImage="/og-images/og-affiliates.webp"
      />

      <HeroAffiliatesPage scrollToContent={scrollToContent} />

      <ValuePropsAffiliates contentRef={contentRef} />

      <WhyFutureFlowerAffiliatesSection />

      <section className="bg-primary">
        <ProductCarousel
          title="How It Works"
          subtitle="Grab your code, share it once, earn on every order that follows."
          steps={affiliateHowItWorksSteps}
        />
      </section>

      <ComparisonSectionHome />


      <CommissionStructureSection />

      <ContentIdeasSection />
    </main>
  );
};

export default AffiliatesPage;
