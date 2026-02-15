import type { OrderBase } from './OrderBase';
import type { DeliveryEvent } from './DeliveryEvent';

export type PartialUpfrontPlan = Partial<UpfrontPlan>;

/**
 * Defines the comprehensive structure for an UpfrontPlan.
 */
export interface UpfrontPlan extends OrderBase {
    years: number;
    events: DeliveryEvent[];
}
