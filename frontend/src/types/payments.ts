// foreverflower/frontend/src/types/payments.ts

/**
 * Defines the payload structure for creating a new payment intent.
 */
export interface CreatePaymentIntentPayload {
  upfront_plan_id: string; // Changed from flower_plan_id
  amount?: number;
  budget?: number;
  years?: number;
  deliveries_per_year?: number;
  currency?: string;
}

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