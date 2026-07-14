import type { StaticImageData } from 'next/image';

export interface ImpactTier {
  name: string;
  price: number;
  description: string;
  image: string | StaticImageData;
  badge?: string;
}
