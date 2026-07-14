import smallFlowers from '@/assets/small_flowers.png';
import medFlowers from '@/assets/med_flowers.png';
import largeFlowers from '@/assets/large_flowers.png';
import type { ImpactTier } from '@/types/ImpactTier';
import { MIN_BUDGET } from '@/utils/systemConstants';

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
    price: 300,
    description: 'A show-stopping display of luxury blooms for life\'s biggest milestones.',
    image: largeFlowers,
  },
];

export const TIER_PRICES = new Set(IMPACT_TIERS.map((t) => t.price));

export const getImpactTier = (price: number): ImpactTier | undefined => {
  return IMPACT_TIERS.find((t) => t.price === price);
};
