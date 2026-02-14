import { useRef } from 'react';
import Seo from '../components/Seo';
import { FaqV2 } from '../components/FaqV2';
import { Timeline } from '../components/florists_page/Timeline';
import { SendBusinessYourWay } from '../components/florists_page/SendBusinessYourWay';
import { ValuePropsA } from '../components/florists_page/ValuePropsA';
import type { FaqItem } from '@/types/FaqItem';
import { NonDeliveryPartnersSection } from '../components/florists_page/NonDeliveryPartnersSection';
import { HeroFloristPage } from '../components/florists_page/HeroFloristPage';
import { WhyFutureFlowerSection } from '../components/florists_page/WhyFutureFlowerSection';
import { ServicesCarouselSection } from '../components/florists_page/ServicesCarouselSection';
import { SoWhatsTheCatchSection } from '../components/florists_page/SoWhatsTheCatchSection';

const FloristsPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const floristFaqs: FaqItem[] = [
    {
      question: 'What if I can\'t or don\'t want to fulfill a delivery?',
      answer: 'No problem at all. If you can\'t fulfill a delivery request from a customer you referred to us, we\'ll pass the business on to another florist and cut you a 5% referral bonus. You can always say no to a delivery request without penalty.',
    },
    {
      question: 'How do refunds work?',
      answer: 'If a customer has a legitimate refund request and we are at fault, we pay back the full amount. If you are at fault (unfulfilled order, quality issues, etc.), we refund the full amount to the customer and request that you refund us the amount we paid you.',
    },
    {
      question: 'Is there a service debt or lock-in?',
      answer: 'No service debts. You\'ll receive a request for all orders from customers you sign up, but if you can\'t or don\'t want to fulfil a request, we\'ll pass it to another florist and give you a 5% commission instead. Conversely, requests that other florists can\'t fill can come straight to you.',
    },
    {
      question: 'What does it cost?',
      answer: 'FutureFlower is completely free to use. There are no setup fees, monthly charges, or hidden costs. Just set up a QR code in-store and/or a link on your website and you\'re ready to go.',
    },
    {
      question: 'What countries do you operate in?',
      answer: 'Currently we operate in the EU (Europe), United Kingdom, North America (USA & Canada), Australia and New Zealand.',
    },
  ];

  return (
    <main>
      <Seo
        title="FutureFlower for Florists | Grow Your Revenue"
        description="Extend your service beyond today's purchase. Offer scheduled deliveries, subscriptions, and prepaid plans — all without adding admin, complexity, or cost."
        canonicalPath="/florists"
        ogImage="/og-images/og-homepage.webp"
      />

      <HeroFloristPage scrollToContent={scrollToContent} />

      <ValuePropsA contentRef={contentRef} />

      <WhyFutureFlowerSection />

      <ServicesCarouselSection />
      <Timeline />
      <SendBusinessYourWay />

      <SoWhatsTheCatchSection />

      <NonDeliveryPartnersSection />

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
