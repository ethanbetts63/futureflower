export interface CheckoutFormProps {
  planId: string;
  source?: string;
  intentType?: 'payment' | 'setup';
}
