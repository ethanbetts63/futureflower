import type { RecipientData } from './RecipientData';

export interface RecipientFormProps {
  formData: RecipientData;
  onFormChange: (field: keyof RecipientData, value: string) => void;
  title?: string;
  /** Hide the recipient name inputs (used when the customer is the recipient). */
  hideNameFields?: boolean;
}
