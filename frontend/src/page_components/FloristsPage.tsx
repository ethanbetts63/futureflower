"use client";

import { useRef } from 'react';
import Seo from '../components/Seo';
import { ProductCarousel } from '../components/ProductCarousel';
import type { ProductCarouselStep } from '../components/ProductCarousel';
import { FaqV2 } from '../components/FaqV2';
import floristPackingImage from '../assets/florist_packing.webp';
import floristPackingImage320 from '../assets/florist_packing-320w.webp';
import floristPackingImage640 from '../assets/florist_packing-640w.webp';
import floristPackingImage768 from '../assets/florist_packing-768w.webp';
import floristPackingImage1024 from '../assets/florist_packing-1024w.webp';
import floristPackingImage1280 from '../assets/florist_packing-1280w.webp';

import petalImage320 from '../assets/petal-320w.webp';
import petalImage640 from '../assets/petal-640w.webp';
import petalImage768 from '../assets/petal-768w.webp';
import petalImage1024 from '../assets/petal-1024w.webp';
import petalImage1280 from '../assets/petal-1280w.webp';

import deliveryImage from '../assets/delivery.webp';
import deliveryImage320 from '../assets/delivery-320w.webp';
import deliveryImage360 from '../assets/delivery-360w.webp';
import deliveryImage640 from '../assets/delivery-640w.webp';
import deliveryImage768 from '../assets/delivery-768w.webp';
import deliveryImage1024 from '../assets/delivery-1024w.webp';
import deliveryImage1280 from '../assets/delivery-1280w.webp';
import { ValuePropsA } from '../components/florists_page/ValuePropsA';
import type { FaqItem } from '@/types/FaqItem';
import { HeroFloristPage } from '../components/florists_page/HeroFloristPage';
import { WhyFutureFlowerSection } from '../components/florists_page/WhyFutureFlowerSection';
import { SoWhatsTheCatchSection } from '../components/florists_page/SoWhatsTheCatchSection';
import ComparisonSectionFlorists from '../components/florists_page/ComparisonSectionFlorists';
import { assetSrc } from '@/lib/assets';

const FloristsPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const floristHowItWorksSteps: ProductCarouselStep[] = [
    {
      level: 1,
      title: 'Sign Up for Free.',
      description:
        'Tell us about your shop and the area you deliver to. No fees, no contracts, no minimums.',
      image: {
        src: assetSrc(floristPackingImage),
        srcSet: `${assetSrc(floristPackingImage320)} 320w, ${assetSrc(floristPackingImage640)} 640w, ${assetSrc(floristPackingImage768)} 768w, ${assetSrc(floristPackingImage1024)} 1024w, ${assetSrc(floristPackingImage1280)} 1280w`,
        sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
        alt: 'Florist packing a bouquet for delivery',
      },
    },
    {
      level: 2,
      title: 'We Send You Orders Nearby.',
      description:
        'Customers give us the occasion, budget, and preferences — not a catalog picture. You get the full brief by text and email.',
      image: {
        src: assetSrc(petalImage1280),
        srcSet: `${assetSrc(petalImage320)} 320w, ${assetSrc(petalImage640)} 640w, ${assetSrc(petalImage768)} 768w, ${assetSrc(petalImage1024)} 1024w, ${assetSrc(petalImage1280)} 1280w`,
        sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
        alt: 'Flower petals representing a customer order brief',
      },
    },
    {
      level: 3,
      title: 'Accept, Design, Deliver.',
      description:
        'Take the orders you want with one tap. Design freely from the stock you have on hand and deliver under your own brand. Decline anything — no penalties, ever.',
      image: {
        src: assetSrc(deliveryImage),
        srcSet: `${assetSrc(deliveryImage320)} 320w, ${assetSrc(deliveryImage360)} 360w, ${assetSrc(deliveryImage640)} 640w, ${assetSrc(deliveryImage768)} 768w, ${assetSrc(deliveryImage1024)} 1024w, ${assetSrc(deliveryImage1280)} 1280w`,
        sizes: "(max-width: 767px) 320px, (max-width: 1023px) 50vw, 33vw",
        alt: 'Florist delivering a finished bouquet',
      },
    },
  ];

  const floristFaqs: FaqItem[] = [
    {
      question: 'Do I have to accept every order?',
      answer: 'No. Every order is voluntary. If you\'re fully booked, low on stock, or just don\'t want the job, decline it — there\'s no penalty and it doesn\'t affect the orders we send you in future.',
    },
    {
      question: 'What does it cost?',
      answer: 'Nothing. There are no setup fees, monthly charges, or hidden costs. Every order shows the amount you\'ll be paid up front — accept it and that\'s what you get, including the full delivery fee.',
    },
    {
      question: 'Do I have to follow a set recipe?',
      answer: 'No. Customers give us a budget and preferences, not a picture to copy. You design whatever suits the brief from the flowers you actually have on hand.',
    },
    {
      question: 'How do refunds work?',
      answer: 'If a customer has a legitimate refund request and we are at fault, we cover the full amount. If the issue is with the flowers or the delivery, we refund the customer and ask you to return what we paid you for that order.',
    }
  ];

  return (
    <main>
      <Seo
        title="FutureFlower for Florists | Fully Paid Local Orders, Zero Fees"
        description="Free to join. We send you fully paid local orders — take the ones you want, design from the stock you have, and deliver under your own brand."
        canonicalPath="/florists"
        ogImage="/og-images/og-homepage.webp"
      />

      <HeroFloristPage scrollToContent={scrollToContent} />

      <ValuePropsA contentRef={contentRef} />

      <WhyFutureFlowerSection />

      <section className="bg-primary">
        <ProductCarousel
          title="How It Works"
          subtitle="Sign up once. Take the orders you want. Nothing else changes."
          steps={floristHowItWorksSteps}
        />
      </section>

      <ComparisonSectionFlorists />

      <SoWhatsTheCatchSection />

      {/* FAQ */}
      <div className="bg-[var(--color4)]">
        <section className="pb-8">
          <FaqV2
            title="Frequently Asked Questions"
            faqs={floristFaqs}
          />
        </section>
      </div>
    </main>
  );
};

export default FloristsPage;
