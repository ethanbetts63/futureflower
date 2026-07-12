export interface DiscountCodeInputProps {
  planId: string;
  existingCode?: string | null;
  onDiscountApplied: () => void;
}
