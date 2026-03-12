import type { DiscountCode } from '@/types';

export interface DiscountCodesSectionProps {
  codes: DiscountCode[];
  onCodesChange: (codes: DiscountCode[]) => void;
}
