// frontend/src/types/OrderBase.ts

export interface OrderBase {
    id: number;
    user: number;
    status: string;
    start_date?: string;
    currency: string;
    
    recipient_first_name: string | null;
    recipient_last_name: string | null;
    recipient_street_address: string | null;
    recipient_suburb: string | null;
    recipient_city: string | null;
    recipient_state: string | null;
    recipient_postcode: string | null;
    recipient_country: string | null;

    budget: number;
    total_amount: number;
    frequency: string;

    preferred_delivery_time: string | null;
    delivery_notes: string | null;

    preferred_flower_types: number[];
    flower_notes?: string | null;

    draft_card_messages?: Record<string, string>;
}
