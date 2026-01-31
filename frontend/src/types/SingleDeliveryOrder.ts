// frontend/src/types/SingleDeliveryOrder.ts
import type { SingleDeliveryPlan } from './SingleDeliveryPlan';

/**
 * Defines the comprehensive structure for a SingleDeliveryOrder,
 * extending the base SingleDeliveryPlan with optional fields typically
 * returned from the API.
 * This should match the backend model fields after migration.
 */
export interface SingleDeliveryOrder extends SingleDeliveryPlan {
    // All fields from SingleDeliveryPlan are inherited.
    // Additional fields or overrides can be placed here if needed.
}
