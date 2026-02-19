import type { ProductCarouselStep } from './ProductCarouselStep';

export interface ProductCarouselProps {
  title: string;
  subtitle: string;
  steps: ProductCarouselStep[];
}
