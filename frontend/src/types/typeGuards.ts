// frontend/src/types/typeGuards.ts
import type { Plan, UpfrontPlan, SubscriptionPlan } from './';

/**
 * Checks if the given plan is a SubscriptionPlan.
 * Determined by the presence of price_per_delivery, which is unique to subscriptions.
 */
export const isSubscriptionPlan = (plan: Plan): plan is SubscriptionPlan => {
    return 'price_per_delivery' in plan;
};

/**
 * Checks if the given plan is an UpfrontPlan (and not a SubscriptionPlan).
 * Determined by the presence of total_amount, which is unique to upfront plans.
 */
export const isUpfrontPlan = (plan: Plan): plan is UpfrontPlan => {
    return 'total_amount' in plan && !isSubscriptionPlan(plan);
};
