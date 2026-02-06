/**
 * Defines the generic payload structure for creating a new payment intent.
 * This is used by the centralized checkout service.
 */
export interface CreatePaymentIntentPayload {
  item_type: 'UPFRONT_PLAN_MODIFY' | 'UPFRONT_PLAN_NEW' | 'SUBSCRIPTION_PLAN_NEW' | 'SINGLE_DELIVERY_PLAN_NEW';
  details: {
    // Depending on the item_type, different properties will be required.
    upfront_plan_id?: string;
    subscription_plan_id?: string;
    single_delivery_plan_id?: string;
    stripe_price_id?: string | null;
    budget?: number;
    years?: number;
    deliveries_per_year?: number;
    [key: string]: any; // Allows for other properties
  };
}
