import Seo from '../components/Seo';
import HomeStarterForm from '@/components/home_page/HomeStarterForm';
import { FaqV2 } from '../components/FaqV2';
import type { FaqItem } from '@/types/FaqItem';
import { Check, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

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
    title: 'Built for Australia first',
    text: 'We are narrowing the product around Australian deliveries before expanding anywhere else.',
  },
  {
    icon: ShieldCheck,
    title: 'Details before payment',
    text: 'Add the delivery address, date, message, and recipient details before you pay.',
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
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl grid-cols-1 items-center gap-0 px-0 pb-0 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-8 lg:py-12">
          <div className="min-w-0 px-5 sm:px-6 lg:px-0">
            <div className="max-w-full sm:max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black/60 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[var(--colorgreen)]" />
                Australian flower delivery
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] text-black font-playfair-display sm:text-6xl lg:text-7xl">
                Flowers done your way.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/65">
                Choose the occasion, budget, and preferences. We organise a bouquet that fits, made by a florist rather than picked from a warehouse catalog.
              </p>
            </div>

            <div className="-mx-5 mt-8 w-[calc(100%+2.5rem)] max-w-none sm:-mx-6 sm:w-[calc(100%+3rem)] lg:mx-0 lg:w-full lg:max-w-2xl">
              <HomeStarterForm />
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden bg-black lg:min-h-[720px] lg:rounded-xl">
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

      <section className="bg-[#fbfaf7] py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
              Simple by design
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight font-playfair-display sm:text-4xl">
              A better order starts with a better brief.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Choose a feeling instead of scrolling through lookalike bouquets.',
              'Set the budget before the florist starts planning.',
              'Add favourite colours, dislikes, allergies, or special requests.',
              'Continue to recipient, address, date, and payment details.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm shadow-black/5">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--colorgreen)]" />
                <p className="text-sm font-medium leading-relaxed text-black/70">{item}</p>
              </div>
            ))}
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
