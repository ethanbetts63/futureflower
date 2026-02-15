// frontend/src/types/typeGuards.ts
import type { Plan, UpfrontPlan, SubscriptionPlan } from './';

/**
 * Checks if the given plan is a SubscriptionPlan.
 * Subscription plans do not have a 'years' field.
 */
export const isSubscriptionPlan = (plan: Plan): plan is SubscriptionPlan => {
    return !('years' in plan);
};

/**
 * Checks if the given plan is an UpfrontPlan.
 * Upfront plans always have a 'years' field.
 */
export const isUpfrontPlan = (plan: Plan): plan is UpfrontPlan => {
    return 'years' in plan;
};
