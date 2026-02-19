export interface DiscountCodeInputProps {
  planId: string;
  planType: 'upfront' | 'subscription';
  existingCode?: string | null;
  onDiscountApplied: () => void;
}
