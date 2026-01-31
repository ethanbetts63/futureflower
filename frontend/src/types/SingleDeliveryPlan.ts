// frontend/src/types/SingleDeliveryPlan.ts
import type { OrderBase } from './OrderBase';
import type { DeliveryEvent } from './DeliveryEvent';

/**
 * Defines the comprehensive structure for a SingleDeliveryPlan.
 */
export interface SingleDeliveryPlan extends OrderBase {
    budget: string; // Stored as DecimalField in Django, often handled as string in frontend
    total_amount: number;
    events: DeliveryEvent[]; 
}
