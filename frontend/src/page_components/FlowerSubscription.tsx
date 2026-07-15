import OccasionLandingPage, { type OccasionLandingPageConfig } from './OccasionLandingPage';
import { buildServiceSchema } from '@/lib/seo';
import type { FaqItem } from '@/types/FaqItem';
import { CalendarClock, Leaf, Palette, RefreshCw, ShieldCheck } from 'lucide-react';

const subscriptionFaqs: FaqItem[] = [
  {
    question: 'How does a flower subscription with FutureFlower work?',
    answer:
      'Set a budget and delivery frequency — weekly, fortnightly, or monthly — and a local Australian florist designs a fresh bouquet for each delivery. Every drop is built from what is best and in season that week, so no two arrivals are identical.',
  },
  {
    question: 'Can I pause or cancel my flower subscription?',
    answer:
      'Yes. A subscription is a recurring version of a normal order, so you stay in control. Pause when you are away, skip a delivery, or cancel at any time — there is no lock-in contract.',
  },
  {
    question: 'Can I send a flower subscription as a gift?',
    answer:
      'Absolutely. Enter the recipient\'s address, choose how many deliveries you want to gift, and add a card message. Each delivery arrives under the local florist\'s own name with your note attached.',
  },
  {
    question: 'Will every bouquet in my subscription look the same?',
    answer:
      'No — that is the point. Instead of repeating one catalog recipe, your florist designs around the freshest seasonal stems each cycle while keeping to your budget and any preferences you set, like favourite colours or flowers to avoid.',
  },
  {
    question: 'Where do you deliver flower subscriptions?',
    answer:
      'FutureFlower is focused on Australia. Recurring delivery availability depends on the delivery address and local florist coverage.',
  },
];

const config: OccasionLandingPageConfig = {
  seo: {
    canonicalPath: '/flower-subscription',
    structuredData: buildServiceSchema({
      serviceType: 'Flower Subscription Delivery',
      name: 'Flower Subscription by FutureFlower',
      description:
        'Recurring flower delivery designed by local Australian florists. Choose a frequency and budget, and receive fresh seasonal bouquets on a weekly, fortnightly, or monthly schedule.',
    }),
  },
  heroTitle: 'Fresh flowers on repeat, done your way.',
  heroSubtext:
    'Set a budget and how often you want flowers to arrive. A local Australian florist designs a new seasonal bouquet for every delivery — pause, skip, or cancel whenever you like.',
  imageOverlayTitle: 'A standing brief, not a standing order.',
  imageOverlayText:
    'Your florist works from the same notes each cycle, then designs fresh from whatever is best that week. Never the same bouquet twice.',
  trustPoints: [
    {
      icon: RefreshCw,
      title: 'Flexible by default',
      text: 'Weekly, fortnightly, or monthly — pause, skip a delivery, or cancel anytime. No lock-in contract.',
    },
    {
      icon: CalendarClock,
      title: 'Set once, enjoy on repeat',
      text: 'Give the brief a single time. Each delivery is handled for you without re-ordering or reminders.',
    },
    {
      icon: ShieldCheck,
      title: 'We make it right',
      text: 'Something off with a delivery? Tell us and we will sort it — refund or redelivery, every cycle.',
    },
  ],
  betterForEveryoneBenefits: [
    {
      icon: Leaf,
      audience: 'Better for the environment',
      text: 'Recurring briefs let florists plan ahead and use the best of each week\'s stock, so far less is wasted.',
    },
    {
      icon: Palette,
      audience: 'Better for the florist',
      text: 'A standing brief means dependable, designable work instead of one-off rushes and repeated catalog recipes.',
    },
    {
      icon: RefreshCw,
      audience: 'Better for you',
      text: 'Fresh flowers arrive on your schedule, shaped around your budget and preferences — no re-ordering each time.',
    },
  ],
  howItWorksHeading: 'Three steps to flowers on repeat.',
  howItWorksSteps: [
    {
      title: 'Set your brief and frequency',
      text: 'Choose your budget, how often you want deliveries, and any preferences — favourite colours, things to avoid, the feeling you\'re after.',
    },
    {
      title: 'A local florist designs each one',
      text: 'For every cycle, a florist near the delivery address designs a fresh bouquet from the best of what\'s in season — matching your brief, never repeating it.',
    },
    {
      title: 'Delivered on schedule',
      text: 'Each bouquet is made fresh and delivered on your chosen rhythm under the florist\'s own name. Pause or adjust whenever life changes.',
    },
  ],
  checklistHeading: 'A better subscription starts with a better brief.',
  checklistItems: [
    'Choose weekly, fortnightly, or monthly delivery.',
    'Set the budget once — it applies to every delivery.',
    'Add favourite colours, dislikes, or allergies for the florist to follow each cycle.',
    'Pause, skip, or cancel anytime from your account.',
  ],
  faqTitle: 'Flower subscriptions: answered.',
  faqs: subscriptionFaqs,
};

const FlowerSubscription = () => <OccasionLandingPage config={config} />;

export default FlowerSubscription;
