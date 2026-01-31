import type { DeliveryEvent } from './DeliveryEvent';

/**
 * Defines the comprehensive structure for an UpfrontPlan.
 */
export interface UpfrontPlan {
    id: number;
    user: number;
    status: string; // Changed from is_active: boolean;
    start_date?: string;
    budget: string;
    deliveries_per_year: number;
    years: number;
    total_amount: number;
    currency: string;
    
    recipient_first_name: string | null;
    recipient_last_name: string | null;
    recipient_street_address: string | null;
    recipient_suburb: string | null;
    recipient_city: string | null;
    recipient_state: string | null;
    recipient_postcode: string | null;
    recipient_country: string | null;

    preferred_colors: number[];
    preferred_flower_types: number[];
    rejected_colors: number[];
    rejected_flower_types: number[];
    events: DeliveryEvent[]; 
}
