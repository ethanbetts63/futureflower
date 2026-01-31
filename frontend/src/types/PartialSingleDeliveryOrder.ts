// frontend/src/types/PartialSingleDeliveryOrder.ts
import type { SingleDeliveryPlan } from './SingleDeliveryPlan';

/**
 * Defines a partial structure for a SingleDeliveryOrder,
 * useful for updates where not all fields are provided.
 */
export interface PartialSingleDeliveryOrder extends Partial<SingleDeliveryPlan> {
    // All fields from SingleDeliveryPlan are inherited as optional.
}
