import Seo from '../components/Seo';
import HomeStarterForm from '@/components/home_page/HomeStarterForm';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { FaqV2 } from '../components/FaqV2';
import type { FaqItem } from '@/types/FaqItem';
import { MapPin, ShieldCheck, Sparkles, Truck, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FREE_DELIVERY_THRESHOLD } from '@/utils/systemConstants';

import petalImage from '../assets/petal-1280w.webp';
import floristMakingImage from '../assets/florist-1280w.webp';
import deliveryImage from '../assets/delivery-1280w.webp';

const bouquetImages = [
  {
    src: '/images/home/bouquet-pink-wrap.jpg',
    alt: 'Pink rose bouquet wrapped in white paper',
  },
  {
    src: '/images/home/bouquet-vase.jpg',
    alt: 'Pastel bouquet arranged in a glass vase',
  },
  {
    src: '/images/home/bouquet-centrepiece.jpg',
    alt: 'Seasonal flower arrangement on a table',
  },
  {
    src: '/images/home/bouquet-held.jpg',
    alt: 'Fresh hand-tied bouquet held by the stems',
  },
];

const stepImages = [
  {
    image: petalImage,
    imageAlt: 'Flower petals representing a customer brief',
  },
  {
    image: floristMakingImage,
    imageAlt: 'Florist arranging a custom bouquet',
  },
  {
    image: deliveryImage,
    imageAlt: 'Bouquet being delivered to a doorstep',
  },
];

export interface OccasionLandingPageConfig {
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    ogImage: string;
    structuredData: object;
  };
  heroBadge: string;
  heroTitle: string;
  heroSubtext: string;
  imageOverlayTitle: string;
  imageOverlayText: string;
  defaultVibeName?: string;
  trustPoints: { icon: LucideIcon; title: string; text: string }[];
  howItWorksHeading: string;
  howItWorksSteps: { title: string; text: string }[];
  checklistHeading: string;
  checklistItems: string[];
  faqTitle: string;
  faqs: FaqItem[];
}

export const defaultTrustPoints = [
  {
    icon: Sparkles,
    title: 'Florist-led design',
    text: 'No fixed catalog recipe. Your florist works from the occasion, budget, and preferences you provide.',
  },
  {
    icon: MapPin,
    title: 'Always supporting local',
    text: 'Every order is made and delivered by a local Australian florist — their name on the delivery, your money in their till.',
  },
  {
    icon: ShieldCheck,
    title: 'We make it right',
    text: 'Something wrong with your delivery? Tell us and we\'ll sort it — refund or redelivery.',
  },
];

const OccasionLandingPage = ({ config }: { config: OccasionLandingPageConfig }) => {
  return (
    <main className="overflow-x-hidden bg-white text-black">
      <Seo
        title={config.seo.title}
        description={config.seo.description}
        canonicalPath={config.seo.canonicalPath}
        ogImage={config.seo.ogImage}
        structuredData={config.seo.structuredData}
      />

      <section className="relative overflow-hidden bg-[#f8f3ef]">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl grid-cols-1 items-start gap-0 px-0 pb-0 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-8 lg:py-12">
          <div className="min-w-0 px-5 sm:px-6 lg:col-start-1 lg:row-start-1 lg:self-end lg:px-0 lg:pb-4">
            <div className="max-w-full sm:max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[var(--colorgreen)]" />
                  {config.heroBadge}
                </p>
                <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60 shadow-sm">
                  <Truck className="h-3.5 w-3.5 text-[var(--colorgreen)]" aria-hidden="true" />
                  Free delivery over ${FREE_DELIVERY_THRESHOLD}
                </p>
              </div>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] text-black font-playfair-display sm:text-6xl lg:text-7xl">
                {config.heroTitle}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/65">
                {config.heroSubtext}
              </p>
            </div>
          </div>

          <div
            id="start-order"
            className="order-2 mt-8 min-w-0 scroll-mt-24 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0"
          >
            <HomeStarterForm defaultVibeName={config.defaultVibeName} />
          </div>

          <div className="order-3 relative mt-8 min-h-[520px] overflow-hidden bg-black lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-0 lg:min-h-[560px] lg:rounded-xl">
            {bouquetImages.map((image, index) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                className="homepage-bouquet-frame absolute inset-0 h-full w-full object-cover"
                style={{ animationDelay: `${index * 4}s` }}
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 pt-20 sm:p-8 sm:pt-24">
              <div className="max-w-sm text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]">
                <p className="text-sm font-semibold">{config.imageOverlayTitle}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/90">
                  {config.imageOverlayText}
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .homepage-bouquet-frame {
            opacity: 0;
            animation: homepage-bouquet-cycle 16s infinite;
          }

          .homepage-bouquet-frame:first-child {
            opacity: 1;
          }

          @keyframes homepage-bouquet-cycle {
            0% { opacity: 0; transform: scale(1.03); }
            5% { opacity: 1; }
            25% { opacity: 1; }
            31% { opacity: 0; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.03); }
          }
        `}</style>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-black/10 px-5 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
          {config.trustPoints.map(({ icon: Icon, title, text }) => (
            <div key={title} className="py-8 md:px-7">
              <Icon className="h-6 w-6 text-black" />
              <h2 className="mt-4 text-xl font-bold font-playfair-display">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <HowItWorksSection
        heading={config.howItWorksHeading}
        steps={config.howItWorksSteps.map((step, index) => ({
          ...step,
          image: stepImages[index].image,
          imageAlt: stepImages[index].imageAlt,
        }))}
      />

      <section className="bg-[#fbfaf7] py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
              Simple by design
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight font-playfair-display sm:text-4xl">
              {config.checklistHeading}
            </h2>
          </div>

          <div className="self-center rounded-xl bg-white shadow-sm shadow-black/5">
            <ul className="divide-y divide-black/5">
              {config.checklistItems.map((item) => (
                <li key={item} className="flex items-start gap-3 px-5 py-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--colorgreen)]" />
                  <p className="font-medium leading-relaxed text-black/70">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="bg-[#fbfaf7]">
        <section className="pb-8">
          <FaqV2 title={config.faqTitle} faqs={config.faqs} />
        </section>
      </div>
    </main>
  );
};

export default OccasionLandingPage;
