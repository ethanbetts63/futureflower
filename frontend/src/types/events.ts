// foreverflower/frontend/src/types/events.ts

/**
 * Defines the structure of an Event object.
 */
export interface Event {
    id: number;
    order: number;
    delivery_date: string;
    message: string | null;
    bouquet_preference: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

/**
 * Defines the response structure for event creation.
 */
export interface EventCreationResponse {
    event: {
        name: string;
        event_date: string;
        notes: string | null;
    };
    user: {
        email: string;
    };
}