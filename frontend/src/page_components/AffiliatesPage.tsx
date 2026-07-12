"use client";

import { useRef } from 'react';
import Seo from '../components/Seo';
import { HeroAffiliatesPage } from '../components/affiliates_page/HeroAffiliatesPage';
import { ValuePropsAffiliates } from '../components/affiliates_page/ValuePropsAffiliates';
import { WhyFutureFlowerAffiliatesSection } from '../components/affiliates_page/WhyFutureFlowerAffiliatesSection';
import { ProductCarousel } from '../components/ProductCarousel';
import type { ProductCarouselStep } from '../components/ProductCarousel';
import { ContentIdeasSection } from '../components/affiliates_page/ContentIdeasSection';
import petalImage320 from '../assets/petal-320w.webp';
import petalImage640 from '../assets/petal-640w.webp';
import petalImage768 from '../assets/petal-768w.webp';
import petalImage1024 from '../assets/petal-1024w.webp';
import petalImage1280 from '../assets/petal-1280w.webp';

import floristImage320 from '../assets/florist-320w.webp';
import floristImage640 from '../assets/florist-640w.webp';
import floristImage768 from '../assets/florist-768w.webp';
import floristImage1024 from '../assets/florist-1024w.webp';
import floristImage1280 from '../assets/florist-1280w.webp';

import deliveryImage320 from '../assets/delivery-320w.webp';
import deliveryImage360 from '../assets/delivery-360w.webp';
import deliveryImage640 from '../assets/delivery-640w.webp';
import deliveryImage768 from '../assets/delivery-768w.webp';
import deliveryImage1024 from '../assets/delivery-1024w.webp';
import deliveryImage1280 from '../assets/delivery-1280w.webp';
import { assetSrc } from '@/lib/assets';


const AffiliatesPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const affiliateHowItWorksSteps: ProductCarouselStep[] = [
    {
      level: 1,
      title: 'Grab Your Code.',
      description:
        'Create your account and get your custom $5 discount code (e.g., DEBRA5) in minutes.',
      image: {
        src: assetSrc(petalImage1280),
        srcSet: `${assetSrc(petalImage320)} 320w, ${assetSrc(petalImage640)} 640w, ${assetSrc(petalImage768)} 768w, ${assetSrc(petalImage1024)} 1024w, ${assetSrc(petalImage1280)} 1280w`,
        sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
        alt: 'Flower petals representing an affiliate discount code',
      },
    },
    {
      level: 2,
      title: 'Share It With Your Audience.',
      description:
        'The pitch is one sentence: give a local florist your budget and preferences, and they design something custom. Your code takes $5 off.',
      image: {
        src: assetSrc(floristImage1280),
        srcSet: `${assetSrc(floristImage320)} 320w, ${assetSrc(floristImage640)} 640w, ${assetSrc(floristImage768)} 768w, ${assetSrc(floristImage1024)} 1024w, ${assetSrc(floristImage1280)} 1280w`,
        sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
        alt: 'Florist arranging a custom bouquet',
      },
    },
    {
      level: 3,
      title: 'Get Paid.',
      description:
        'Every time a new customer orders with your code, you earn a flat $10 once their delivery is complete. No tiers, no spreadsheets.',
      image: {
        src: assetSrc(deliveryImage1280),
        srcSet: `${assetSrc(deliveryImage320)} 320w, ${assetSrc(deliveryImage360)} 360w, ${assetSrc(deliveryImage640)} 640w, ${assetSrc(deliveryImage768)} 768w, ${assetSrc(deliveryImage1024)} 1024w, ${assetSrc(deliveryImage1280)} 1280w`,
        sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
        alt: 'Bouquet being delivered to a customer',
      },
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

      <HeroAffiliatesPage scrollToContent={scrollToContent} />

      <ValuePropsAffiliates contentRef={contentRef} />

      <section className="bg-primary">
        <ProductCarousel
          title="How It Works"
          subtitle="Grab your code, share it, get paid for every new customer."
          steps={affiliateHowItWorksSteps}
        />
      </section>

      <WhyFutureFlowerAffiliatesSection />

      <ContentIdeasSection />
    </main>
  );
};

export default AffiliatesPage;
