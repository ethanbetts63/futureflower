import type { UpfrontPlan } from './UpfrontPlan';

/**
 * Defines the comprehensive structure for a SubscriptionPlan.
 */
export interface SubscriptionPlan extends UpfrontPlan {
    delivery_frequency_unit: string;
    delivery_frequency_value: number;
    recurring_price: number;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    stripe_price_id: string | null; // Added stripe_price_id
    frequency: string;
    price_per_delivery: number;
    subscription_message: string | null;
}
