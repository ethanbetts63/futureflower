/**
 * Defines the structure for a Payment object, matching the PaymentSerializer from the backend.
 */
export interface Payment {
  id: number;
  amount: string;
  status: 'succeeded' | 'pending' | 'failed';
  created_at: string;
  stripe_payment_intent_id: string; 
}
