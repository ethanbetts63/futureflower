import Seo from '../components/Seo';
import HomeStarterForm from '@/components/home_page/HomeStarterForm';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { FaqV2 } from '../components/FaqV2';
import type { FaqItem } from '@/types/FaqItem';
import { Check, MapPin, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { FREE_DELIVERY_THRESHOLD } from '@/utils/systemConstants';
import { assetSrc } from '@/lib/assets';

import petalImage320 from '../assets/petal-320w.webp';
import petalImage640 from '../assets/petal-640w.webp';
import petalImage768 from '../assets/petal-768w.webp';
import petalImage1280 from '../assets/petal-1280w.webp';

import floristMakingImage320 from '../assets/florist_making_flowers-320w.webp';
import floristMakingImage640 from '../assets/florist_making_flowers-640w.webp';
import floristMakingImage768 from '../assets/florist_making_flowers-768w.webp';
import floristMakingImage1280 from '../assets/florist_making_flowers-1280w.webp';

import deliveryImage320 from '../assets/delivery-320w.webp';
import deliveryImage640 from '../assets/delivery-640w.webp';
import deliveryImage768 from '../assets/delivery-768w.webp';
import deliveryImage1280 from '../assets/delivery-1280w.webp';

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

const trustPoints = [
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

const homeFaqs: FaqItem[] = [
  {
    question: 'Do I choose the exact bouquet?',
    answer:
      'No. You choose the occasion, budget, and custom preferences. A florist uses that brief to design something suitable from the flowers available to them.',
  },
  {
    question: 'Can I tell the florist what to avoid?',
    answer:
      'Yes. Add dislikes, allergies, colours to avoid, or anything else the florist should know in the preferences box.',
  },
  {
    question: 'Will I get exactly what I ask for?',
    answer:
      'The florist designs from what\'s fresh and available on the day, matching your preferences as closely as they can. Broad guidance — colours, a feeling, things to avoid — gives them the most to work with. Very specific requests may mean a close substitute if that exact flower isn\'t in season or in stock.',
  },
  {
    question: 'Where do you deliver?',
    answer:
      'FutureFlower is focused on Australia. Availability can depend on the delivery location and florist coverage.',
  },
];

const HomePage = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FutureFlower',
    url: 'https://www.futureflower.app',
    logo: 'https://www.futureflower.app/favicon-192x192.png',
    description:
      'Australian flower delivery service where customers give their preferences and a florist designs a suitable bouquet.',
    areaServed: [{ '@type': 'Country', name: 'Australia' }],
    sameAs: ['https://www.instagram.com/futureflowerapp/'],
    founder: {
      '@type': 'Person',
      name: 'Ethan Betts',
    },
  };

  return (
    <main className="overflow-x-hidden bg-white text-black">
      <Seo
        title="FutureFlower | Australian Florist-Led Flower Delivery"
        description="Tell us the occasion, budget, and flower preferences. A local Australian florist designs a bouquet that fits."
        canonicalPath="/"
        ogImage="/og-images/og-homepage.webp"
        structuredData={organizationSchema}
      />

      <section className="relative overflow-hidden bg-[#f8f3ef]">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl grid-cols-1 items-start gap-0 px-0 pb-0 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-8 lg:py-12">
          <div className="min-w-0 px-5 sm:px-6 lg:col-start-1 lg:row-start-1 lg:self-end lg:px-0 lg:pb-4">
            <div className="max-w-full sm:max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[var(--colorgreen)]" />
                  Australian flower delivery
                </p>
                <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60 shadow-sm">
                  <Truck className="h-3.5 w-3.5 text-[var(--colorgreen)]" aria-hidden="true" />
                  Free delivery over ${FREE_DELIVERY_THRESHOLD}
                </p>
              </div>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] text-black font-playfair-display sm:text-6xl lg:text-7xl">
                Flowers done your way.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/65">
                Choose the occasion, budget, and preferences. We organise a bouquet that fits, made by a florist rather than picked from a warehouse catalog.
              </p>
            </div>
          </div>

          <div
            id="start-order"
            className="order-2 mt-8 min-w-0 scroll-mt-24 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0"
          >
            <HomeStarterForm />
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
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-8">
              <div className="max-w-sm text-white">
                <p className="text-sm font-semibold">A brief, not a catalog order.</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">
                  The florist uses your notes to make the right call on colour, style, and seasonal flowers.
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
          {trustPoints.map(({ icon: Icon, title, text }) => (
            <div key={title} className="py-8 md:px-7">
              <Icon className="h-6 w-6 text-black" />
              <h2 className="mt-4 text-xl font-bold font-playfair-display">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <HowItWorksSection
        heading="Three steps between you and better flowers."
        steps={[
          {
            title: 'Give us the brief',
            text: 'Occasion, budget, and preferences — favourite colours, things to avoid, the feeling you\'re after. Two minutes, no catalog scrolling.',
            image: {
              src: assetSrc(petalImage1280),
              srcSet: `${assetSrc(petalImage320)} 320w, ${assetSrc(petalImage640)} 640w, ${assetSrc(petalImage768)} 768w, ${assetSrc(petalImage1280)} 1280w`,
              alt: 'Flower petals representing a customer brief',
            },
          },
          {
            title: 'A local florist designs it',
            text: 'We pass your brief to a florist near the delivery address. They design something suitable from the best of what\'s in season, matching your notes as closely as the day\'s stock allows.',
            image: {
              src: assetSrc(floristMakingImage1280),
              srcSet: `${assetSrc(floristMakingImage320)} 320w, ${assetSrc(floristMakingImage640)} 640w, ${assetSrc(floristMakingImage768)} 768w, ${assetSrc(floristMakingImage1280)} 1280w`,
              alt: 'Florist arranging a custom bouquet',
            },
          },
          {
            title: 'Delivered on your date',
            text: 'Made fresh, delivered to the door with your card message — under the florist\'s own name, because they made it.',
            image: {
              src: assetSrc(deliveryImage1280),
              srcSet: `${assetSrc(deliveryImage320)} 320w, ${assetSrc(deliveryImage640)} 640w, ${assetSrc(deliveryImage768)} 768w, ${assetSrc(deliveryImage1280)} 1280w`,
              alt: 'Bouquet being delivered to a doorstep',
            },
          },
        ]}
      />

      <section className="bg-[#fbfaf7] py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black">
              Simple by design
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight font-playfair-display sm:text-4xl">
              A better order starts with a better brief.
            </h2>
          </div>

          <div className="self-center rounded-xl bg-white shadow-sm shadow-black/5">
            <ul className="divide-y divide-black/5">
              {[
                'Choose a feeling instead of scrolling through lookalike bouquets.',
                'Set the budget before the florist starts planning.',
                'Add favourite colours, dislikes, allergies, or special requests.',
                'Continue to recipient, address, date, and payment details.',
              ].map((item) => (
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
          <FaqV2 title="Questions? We have answers." faqs={homeFaqs} />
        </section>
      </div>
    </main>
  );
};

export default HomePage;
