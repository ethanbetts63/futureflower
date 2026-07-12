import OccasionLandingPage, {
  defaultTrustPoints,
  type OccasionLandingPageConfig,
} from './OccasionLandingPage';
import type { FaqItem } from '@/types/FaqItem';

const mothersDayFaqs: FaqItem[] = [
  {
    question: "When is Mother's Day in Australia?",
    answer:
      "Mother's Day in Australia falls on the second Sunday in May. It's one of the busiest days of the year for florists, so scheduling ahead locks in your delivery.",
  },
  {
    question: "Can I schedule Mother's Day flower delivery in advance?",
    answer:
      "Yes — you can schedule a Mother's Day delivery weeks or months in advance. Once it's locked in, a local florist handles the arrangement and delivery on the day.",
  },
  {
    question: "What flowers are popular for Mother's Day?",
    answer:
      'Soft, feminine arrangements are popular — peonies, roses, lilies, and mixed pastel bouquets. Your florist designs from your brief and budget, so a note about Mum\'s favourites gives them plenty to work with.',
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
    title: "Mother's Day Flower Delivery | FutureFlower",
    description:
      "Send fresh Mother's Day flowers designed by a local Australian florist. Schedule ahead, set a budget, and never leave it to the last minute.",
    canonicalPath: '/mothers-day-flower-delivery',
    ogImage: '/og-images/og-mothers-day-flowers.webp',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: "Mother's Day Flower Delivery",
      name: "Mother's Day Flower Delivery by FutureFlower",
      description:
        "Fresh Mother's Day flowers designed by local Australian florists. Schedule ahead and never leave it to the last minute.",
      provider: {
        '@type': 'Organization',
        name: 'FutureFlower',
        url: 'https://www.futureflower.app',
      },
      areaServed: [{ '@type': 'Country', name: 'Australia' }],
    },
  },
  heroBadge: "Mother's day delivery",
  heroTitle: 'Mother\'s Day flowers, done your way.',
  heroSubtext:
    'Schedule ahead and never leave it to the last minute. Set a budget and tell us what Mum loves — a local Australian florist designs the rest, delivered on the day.',
  imageOverlayTitle: 'A brief, not a catalog order.',
  imageOverlayText:
    'Her favourite colours, the flowers she grows, the ones she can\'t stand — the florist designs around what makes her, her.',
  defaultVibeName: 'Thank You',
  trustPoints: defaultTrustPoints,
  howItWorksHeading: 'Three steps to making Mum\'s day.',
  howItWorksSteps: [
    {
      title: 'Give us the brief',
      text: 'Your budget and what Mum loves — favourite colours, flowers from her garden, anything to avoid. Two minutes, no catalog scrolling.',
    },
    {
      title: 'A local florist designs it',
      text: 'We pass your brief to a florist near Mum. They design something soft and seasonal from the best of what\'s fresh in May.',
    },
    {
      title: 'Delivered on the day',
      text: 'Made fresh, delivered to her door with your card message — under the florist\'s own name, because they made it.',
    },
  ],
  checklistHeading: 'Sorted well before the second Sunday in May.',
  checklistItems: [
    'Order weeks or months ahead — the delivery is locked to Mother\'s Day.',
    'Set the budget before the florist starts planning.',
    'Add her favourite colours, flowers she loves, or things to avoid.',
    'Include a card message so she knows exactly who it\'s from.',
  ],
  faqTitle: "Mother's Day flowers — answered.",
  faqs: mothersDayFaqs,
};

const MothersDayFlowerDelivery = () => <OccasionLandingPage config={config} />;

export default MothersDayFlowerDelivery;
