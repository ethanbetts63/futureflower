"use client";

import { useRef } from 'react';
import Seo from '../components/Seo';
import { HeroAffiliatesPage } from '../components/affiliates_page/HeroAffiliatesPage';
import { ValuePropsAffiliates } from '../components/affiliates_page/ValuePropsAffiliates';
import { WhyFutureFlowerAffiliatesSection } from '../components/affiliates_page/WhyFutureFlowerAffiliatesSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import type { HowItWorksStep } from '../components/HowItWorksSection';
import { ContentIdeasSection } from '../components/affiliates_page/ContentIdeasSection';
import petalImage from '../assets/petal-1280w.webp';
import floristImage from '../assets/florist-1280w.webp';
import deliveryImage from '../assets/delivery-1280w.webp';


const AffiliatesPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const affiliateHowItWorksSteps: HowItWorksStep[] = [
    {
      title: 'Grab your code',
      text: 'Create your account and get your custom $5 discount code (e.g., DEBRA5) in minutes.',
      image: petalImage,
      imageAlt: 'Flower petals representing an affiliate discount code',
    },
    {
      title: 'Share it with your audience',
      text: 'The pitch is one sentence: give a local florist your budget and preferences, and they design something custom. Your code takes $5 off.',
      image: floristImage,
      imageAlt: 'Florist arranging a custom bouquet',
    },
    {
      title: 'Get paid',
      text: 'Every time a new customer orders with your code, you earn a flat $10 once their delivery is complete. No tiers, no spreadsheets.',
      image: deliveryImage,
      imageAlt: 'Bouquet being delivered to a customer',
    },
  ];

  return (
    <main>
      <Seo
        title="FutureFlower Affiliates | Earn by Gifting"
        description="Give your audience $5 off custom flowers from a local florist and earn $10 for every new customer you send. Simple, flat, no tiers."
        canonicalPath="/affiliates"
        ogImage="/og-images/og-affiliates.webp"
      />

      <HeroAffiliatesPage />

      <ValuePropsAffiliates contentRef={contentRef} />

      <HowItWorksSection
        heading="Grab your code, share it, get paid for every new customer."
        steps={affiliateHowItWorksSteps}
      />

      <WhyFutureFlowerAffiliatesSection />

      <ContentIdeasSection />
    </main>
  );
};

export default AffiliatesPage;
