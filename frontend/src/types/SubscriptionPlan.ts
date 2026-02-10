import type { OrderBase } from './OrderBase';

/**
 * Defines the comprehensive structure for a SubscriptionPlan.
 */
export interface SubscriptionPlan extends OrderBase {
    price_per_delivery: number;
    stripe_subscription_id: string | null;
    subscription_message: string | null;
    next_payment_date: string | null;
    next_delivery_date: string | null;
}
