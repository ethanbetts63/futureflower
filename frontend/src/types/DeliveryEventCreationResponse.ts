/**
 * Defines the response structure for a DeliveryEvent creation.
 */
export interface DeliveryEventCreationResponse {
    event: {
        name: string;
        event_date: string;
        message: string | null;
    };
    user: {
        email: string;
    };
}
