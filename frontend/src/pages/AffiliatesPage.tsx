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
import floristImage from '../assets/florist.webp';
import deliveryHighImage from '../assets/delivery_high.png';


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
        'Get your custom $5 discount code (e.g., DEBRA5) in minutes. Feel free to use it yourself to test the service before you share.',
      image: petalImage, // TODO: replace with code/discount image
    },
    {
      level: 2,
      title: 'Share the Smarter Way to Buy Flowers.',
      description:
        'Show how the same price delivers more flowers, true florist\'s choice design, and real support for local florists.',
      image: floristImage, // TODO: replace with sharing/social image
    },
    {
      level: 3,
      title: 'Triple Dip.',
      description:
        'When a follower uses your code, you get paid for their first order, their second, and their third.',
      image: deliveryHighImage, // TODO: replace with earnings/reward image
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
