// frontend/src/types/typeGuards.ts
import type { Plan, UpfrontPlan, SubscriptionPlan, SingleDeliveryPlan } from './';

/**
 * Checks if the given plan is a SubscriptionPlan.
 * This is determined by the presence of a delivery frequency unit, which is unique to subscriptions.
 * @param plan The plan to check.
 * @returns True if the plan is a SubscriptionPlan.
 */
export const isSubscriptionPlan = (plan: Plan): plan is SubscriptionPlan => {
    return 'delivery_frequency_unit' in plan;
};

/**
 * Checks if the given plan is an UpfrontPlan (and not a SubscriptionPlan).
 * This is determined by the presence of deliveries per year and the absence of a subscription frequency.
 * @param plan The plan to check.
 * @returns True if the plan is a standard UpfrontPlan.
 */
export const isUpfrontPlan = (plan: Plan): plan is UpfrontPlan => {
    return 'deliveries_per_year' in plan && !isSubscriptionPlan(plan);
};

/**
 * Checks if the given plan is a SingleDeliveryPlan.
 * This is determined by the absence of a multi-delivery structure (like deliveries_per_year).
 * @param plan The plan to check.
 * @returns True if the plan is a SingleDeliveryPlan.
 */
export const isSingleDeliveryPlan = (plan: Plan): plan is SingleDeliveryPlan => {
    return !('deliveries_per_year' in plan);
};
