/**
 * Defines the structure of a DeliveryEvent object within the application.
 */
export interface DeliveryEvent {
    id: number;
    order: number;
    delivery_date: string;
    message: string | null;
    bouquet_preference: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}
