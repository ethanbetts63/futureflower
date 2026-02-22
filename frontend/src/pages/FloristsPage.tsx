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
import deliveryImage640 from '../assets/delivery-640w.webp';
import deliveryImage768 from '../assets/delivery-768w.webp';
import deliveryImage1024 from '../assets/delivery-1024w.webp';
import deliveryImage1280 from '../assets/delivery-1280w.webp';
import { SendBusinessYourWay } from '../components/florists_page/SendBusinessYourWay';
import { ValuePropsA } from '../components/florists_page/ValuePropsA';
import type { FaqItem } from '@/types/FaqItem';
import { NonDeliveryPartnersSection } from '../components/florists_page/NonDeliveryPartnersSection';
import { HeroFloristPage } from '../components/florists_page/HeroFloristPage';
import { WhyFutureFlowerSection } from '../components/florists_page/WhyFutureFlowerSection';
import { ServicesCarouselSection } from '../components/florists_page/ServicesCarouselSection';
import { SoWhatsTheCatchSection } from '../components/florists_page/SoWhatsTheCatchSection';
import ComparisonSectionFlorists from '../components/florists_page/ComparisonSectionFlorists';

const FloristsPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const floristHowItWorksSteps: ProductCarouselStep[] = [
    {
      level: 1,
      title: 'Set Up Your Link and/or QR Code.',
      description:
        'Display your unique discount code (instore poster / website link). The discount comes out of our margin, not yours.',
      image: {
        src: floristPackingImage,
        srcSet: `${floristPackingImage320} 320w, ${floristPackingImage640} 640w, ${floristPackingImage768} 768w, ${floristPackingImage1024} 1024w, ${floristPackingImage1280} 1280w`,
        sizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
        alt: 'Florist packing image for setting up link/QR code',
      },
    },
    {
      level: 2,
      title: 'Customer Makes Their Order.',
      description:
        'Customers selects budget, preferences, and delivery details. These will all be provided to you.',
      image: {
        src: petalImage1280,
        srcSet: `${petalImage320} 320w, ${petalImage640} 640w, ${petalImage768} 768w, ${petalImage1024} 1024w, ${petalImage1280} 1280w`,
        sizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
        alt: 'Petal image for customer making their order',
      },
    },
    {
      level: 3,
      title: 'You Accept or Reject Orders.',
      description:
        'Recieve a text and email with an acceptance link. Accept and handle the delivery yourself, or reject for a tiered reward ($5–$25) depending on the bouquet value.',
      image: {
        src: deliveryImage,
        srcSet: `${deliveryImage320} 320w, ${deliveryImage640} 640w, ${deliveryImage768} 768w, ${deliveryImage1024} 1024w, ${deliveryImage1280} 1280w`,
        sizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
        alt: 'Delivery image for accepting or rejecting orders',
      },
    },
  ];

  const floristFaqs: FaqItem[] = [
    {
      question: 'What if I can\'t or don\'t want to fulfill a delivery?',
      answer: 'If a customer you signed up through your link/QR code places an order you can\'t fulfill, we don\'t want you to lose out. We pass the order to a trusted partner and pay you a tiered referral fee ($5 for small bouquets, up to $25 for premium arrangements). It ensures your digital shopfront earns you money even when you\'re fully booked.',
    },
    {
      question: 'How do refunds work?',
      answer: 'If a customer has a legitimate refund request and we are at fault, we pay back the full amount. If you are at fault (unfulfilled order, quality issues, etc.), we refund the full amount to the customer and request that you refund us the amount we paid you.',
    },
    {
      question: 'Is there a service debt or lock-in?',
      answer: 'No service debts. You\'ll receive a request for all orders from customers you sign up, but if you can\'t or don\'t want to fulfil a request, we\'ll pass it to another florist and give you a $5-25 referral bonus instead. Conversely, requests that other florists can\'t fill can come straight to you.',
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

      <section className="bg-primary">
        <ProductCarousel
          title="How It Works"
          subtitle="Set up once, earn ongoing revenue. No admin, no complexity, no cost."
          steps={floristHowItWorksSteps}
        />
      </section>

      <ComparisonSectionFlorists />

      <ServicesCarouselSection />
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
