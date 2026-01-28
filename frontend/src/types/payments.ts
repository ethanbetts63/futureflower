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