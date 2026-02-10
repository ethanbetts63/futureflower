import type { OrderBase } from './OrderBase';
import type { DeliveryEvent } from './DeliveryEvent';

export type PartialUpfrontPlan = Partial<UpfrontPlan>;

/**
 * Defines the comprehensive structure for an UpfrontPlan.
 */
export interface UpfrontPlan extends OrderBase {
    budget: string;
    deliveries_per_year: number;
    years: number;
    total_amount: number;
    events: DeliveryEvent[];
}
