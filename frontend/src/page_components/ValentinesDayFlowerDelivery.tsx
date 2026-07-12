import OccasionLandingPage, {
  defaultTrustPoints,
  type OccasionLandingPageConfig,
} from './OccasionLandingPage';
import type { FaqItem } from '@/types/FaqItem';

const valentinesFaqs: FaqItem[] = [
  {
    question: "When should I order flowers for Valentine's Day?",
    answer:
      'Most florists are overwhelmed with last-minute orders on February 14. Ordering weeks or months in advance locks in your delivery and gives the florist more time to craft a better arrangement.',
  },
  {
    question: "Can I schedule Valentine's Day flower delivery in advance?",
    answer:
      "Yes — FutureFlower is built for scheduling ahead. Pick February 14, set your budget, and the order is locked in. The florist makes and delivers the flowers on the day.",
  },
  {
    question: "What flowers are best for Valentine's Day?",
    answer:
      'Red roses are the classic choice, but many people opt for mixed arrangements including tulips, peonies, or lisianthus. Your florist designs from your brief and budget, so a simple note like "romantic, soft colours" is enough to work with.',
  },
  {
    question: 'Do I choose the exact bouquet?',
    answer:
      'No. You choose the occasion, budget, and custom preferences. A florist uses that brief to design something suitable from the flowers available to them.',
  },
  {
    question: 'Where do you deliver?',
    answer:
      'FutureFlower is focused on Australia. Availability can depend on the delivery location and florist coverage.',
  },
];

const config: OccasionLandingPageConfig = {
  seo: {
    title: "Valentine's Day Flower Delivery | FutureFlower",
    description:
      "Send fresh Valentine's Day flowers designed by a local Australian florist. Order ahead, set a budget, and skip the February 14 rush.",
    canonicalPath: '/valentines-day-flower-delivery',
    ogImage: '/og-images/og-valentines-flowers.webp',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: "Valentine's Day Flower Delivery",
      name: "Valentine's Day Flower Delivery by FutureFlower",
      description:
        "Fresh Valentine's Day flowers designed by local Australian florists. Schedule your order months ahead and skip the last-minute rush.",
      provider: {
        '@type': 'Organization',
        name: 'FutureFlower',
        url: 'https://www.futureflower.app',
      },
      areaServed: [{ '@type': 'Country', name: 'Australia' }],
    },
  },
  heroBadge: "Valentine's day delivery",
  heroTitle: 'Valentine\'s flowers, done your way.',
  heroSubtext:
    'Order ahead and skip the February 14 rush. Set a budget and your preferences, and a local Australian florist designs something romantic — delivered on the day.',
  imageOverlayTitle: 'A brief, not a catalog order.',
  imageOverlayText:
    'Roses, or something less expected — the florist uses your notes to design a bouquet that actually feels like the two of you.',
  defaultVibeName: 'Romance',
  trustPoints: defaultTrustPoints,
  howItWorksHeading: 'Three steps to a Valentine\'s Day they\'ll never forget.',
  howItWorksSteps: [
    {
      title: 'Give us the brief',
      text: 'Your budget and preferences — classic red roses, soft pastels, or the feeling you\'re after. Two minutes, no catalog scrolling, months before the rush.',
    },
    {
      title: 'A local florist designs it',
      text: 'We pass your brief to a florist near the delivery address. They design something romantic from the best of what\'s fresh on February 14.',
    },
    {
      title: 'Delivered on the day',
      text: 'Made fresh, delivered to the door with your card message — while everyone else is queuing for whatever\'s left.',
    },
  ],
  checklistHeading: 'Beat the Valentine\'s Day rush.',
  checklistItems: [
    'Order weeks or months ahead — the delivery is locked to February 14.',
    'Set the budget before the florist starts planning.',
    'Add favourite colours, flowers they love, or things to avoid.',
    'Include a card message to say what the flowers can\'t.',
  ],
  faqTitle: "Valentine's Day flowers — answered.",
  faqs: valentinesFaqs,
};

const ValentinesDayFlowerDelivery = () => <OccasionLandingPage config={config} />;

export default ValentinesDayFlowerDelivery;
