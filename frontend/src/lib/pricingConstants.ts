import smallFlowers from '@/assets/small_flowers.png';
import medFlowers from '@/assets/med_flowers.png';
import largeFlowers from '@/assets/large_flowers.png';
import type { ImpactTier } from '@/types/ImpactTier';
import { MIN_BUDGET } from '@/lib/systemConstants';

export type { ImpactTier };
export { MIN_BUDGET };

export const IMPACT_TIERS: ImpactTier[] = [
  {
    name: 'The Signature',
    price: 65,
    description: 'A beautiful, seasonal arrangement. Perfect for any occasion.',
    image: smallFlowers,
  },
  {
    name: 'The Statement',
    price: 125,
    description: 'Lush, premium flowers designed to make an impression. Our most popular choice.',
    image: medFlowers,
    badge: 'Most Popular',
  },
  {
    name: 'The Grand Gesture',
    price: 250,
    description: 'A show-stopping display of luxury blooms for life\'s biggest milestones.',
    image: largeFlowers,
  },
];

export const TIER_PRICES = new Set(IMPACT_TIERS.map((t) => t.price));

export const CUSTOM_IMPACT_IMAGE =
  IMPACT_TIERS.find((t) => t.name === 'The Grand Gesture')?.image ?? IMPACT_TIERS[IMPACT_TIERS.length - 1].image;

export const getImpactTier = (price: number): ImpactTier | undefined => {
  return IMPACT_TIERS.find((t) => t.price === price);
};

export const resolveImpactDisplay = (price: number) => {
  const tier = getImpactTier(price);
  return {
    name: tier ? tier.name : 'Custom Selection',
    image: tier?.image ?? CUSTOM_IMPACT_IMAGE,
  };
};
