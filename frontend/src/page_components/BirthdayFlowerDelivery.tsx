import OccasionLandingPage, {
  defaultTrustPoints,
  type OccasionLandingPageConfig,
} from './OccasionLandingPage';
import type { FaqItem } from '@/types/FaqItem';

const birthdayFaqs: FaqItem[] = [
  {
    question: 'Can I schedule birthday flower delivery for a future date?',
    answer:
      'Yes — FutureFlower is built around scheduling ahead. Pick the birthday date, set your budget, and a local florist handles the arrangement and delivery on the day.',
  },
  {
    question: 'How far in advance can I order birthday flowers?',
    answer:
      'You can schedule a birthday delivery weeks or months in advance. Once it\'s locked in, there\'s nothing to remember — the florist makes and delivers the flowers on the date you chose.',
  },
  {
    question: 'What flowers are best for a birthday?',
    answer:
      'Bright, cheerful arrangements are popular for birthdays — sunflowers, gerberas, and colourful mixed bouquets are common choices. Your florist designs from your brief and what\'s fresh on the day, so you don\'t need to pick exact stems.',
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
    title: 'Birthday Flower Delivery | FutureFlower',
    description:
      'Send fresh birthday flowers designed by a local Australian florist. Pick the date, set a budget, add preferences — the florist handles the rest.',
    canonicalPath: '/birthday-flower-delivery',
    ogImage: '/og-images/og-birthday-flowers.webp',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Birthday Flower Delivery',
      name: 'Birthday Flower Delivery by FutureFlower',
      description:
        'Fresh birthday flowers designed by local Australian florists, delivered on the day. Schedule ahead and never miss a birthday again.',
      provider: {
        '@type': 'Organization',
        name: 'FutureFlower',
        url: 'https://www.futureflower.app',
      },
      areaServed: [{ '@type': 'Country', name: 'Australia' }],
    },
  },
  heroBadge: 'Birthday flower delivery',
  heroTitle: 'Birthday flowers, done your way.',
  heroSubtext:
    'Pick the birthday, set a budget, and tell us what they love. A local Australian florist designs something bright and personal — delivered on the day.',
  imageOverlayTitle: 'A brief, not a catalog order.',
  imageOverlayText:
    'Tell the florist about the birthday person — favourite colours, the feeling you want — and they make the right call on the day.',
  defaultVibeName: 'Birthday',
  trustPoints: defaultTrustPoints,
  howItWorksHeading: 'Three steps to a birthday they\'ll remember.',
  howItWorksSteps: [
    {
      title: 'Give us the brief',
      text: 'The birthday date, your budget, and preferences — their favourite colours, flowers they love, things to avoid. Two minutes, no catalog scrolling.',
    },
    {
      title: 'A local florist designs it',
      text: 'We pass your brief to a florist near the delivery address. They design a fresh, celebratory arrangement from the best of what\'s in season.',
    },
    {
      title: 'Delivered on their birthday',
      text: 'Made fresh, delivered to the door with your card message — under the florist\'s own name, because they made it.',
    },
  ],
  checklistHeading: 'Never miss a birthday again.',
  checklistItems: [
    'Order as far ahead as you like — the delivery is locked to the date.',
    'Set the budget before the florist starts planning.',
    'Add favourite colours, dislikes, allergies, or special requests.',
    'Include a card message so they know who it\'s from.',
  ],
  faqTitle: 'Birthday flower delivery — answered.',
  faqs: birthdayFaqs,
};

const BirthdayFlowerDelivery = () => <OccasionLandingPage config={config} />;

export default BirthdayFlowerDelivery;
