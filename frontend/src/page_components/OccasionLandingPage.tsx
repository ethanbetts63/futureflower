import Seo from '../components/Seo';
import HomeStarterForm from '@/components/home_page/HomeStarterForm';
import { HeroPills } from '@/components/HeroPills';
import { RotatingBouquetHeroImage } from '@/components/RotatingBouquetHeroImage';
import {
  BetterForEveryoneSection,
  type BetterForEveryoneBenefit,
} from '@/components/home_page/BetterForEveryoneSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { FaqV2 } from '../components/FaqV2';
import type { FaqItem } from '@/types/FaqItem';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import petalImage from '../assets/petal-1280w.webp';
import floristMakingImage from '../assets/florist-1280w.webp';
import deliveryImage from '../assets/delivery-1280w.webp';

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
  heroTitle: string;
  heroSubtext: string;
  imageOverlayTitle: string;
  imageOverlayText: string;
  defaultVibeName?: string;
  trustPoints: { icon: LucideIcon; title: string; text: string }[];
  betterForEveryoneBenefits: BetterForEveryoneBenefit[];
  howItWorksHeading: string;
  howItWorksSteps: { title: string; text: string }[];
  checklistHeading: string;
  checklistItems: string[];
  faqTitle: string;
  faqs: FaqItem[];
}

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
              <h1 className="text-4xl font-bold leading-[1.05] text-black font-playfair-display sm:text-6xl lg:text-7xl">
                {config.heroTitle}
              </h1>
              <HeroPills />
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

          <RotatingBouquetHeroImage
            className="order-3 relative mt-8 min-h-[520px] overflow-hidden bg-black lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-0 lg:min-h-[560px] lg:rounded-xl"
            overlay={
              <div className="max-w-sm text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]">
                <p className="text-sm font-semibold">{config.imageOverlayTitle}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/90">
                  {config.imageOverlayText}
                </p>
              </div>
            }
          />
        </div>
      </section>

      <BetterForEveryoneSection benefits={config.betterForEveryoneBenefits} />

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

      <div className="bg-[#fbfaf7]">
        <section className="pb-8">
          <FaqV2 title={config.faqTitle} faqs={config.faqs} />
        </section>
      </div>
    </main>
  );
};

export default OccasionLandingPage;
