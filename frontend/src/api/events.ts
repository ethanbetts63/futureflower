
import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { DeliveryEvent, Color, FlowerType } from "@/types";

// Define type for breakdown structure from API response
import type { DeliveryEvent, Color, FlowerType, PriceBreakdown } from "@/types";

type CalculatePricePayload = {
  budget: number;
  deliveries_per_year: number;
  years: number;
}

export async function getEvents(): Promise<DeliveryEvent[]> {
    const response = await authedFetch('/api/events/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function getEvent(id: string): Promise<DeliveryEvent> {
    const response = await authedFetch(`/api/events/${id}/`, {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function createAuthenticatedEvent(eventData: Partial<DeliveryEvent>): Promise<DeliveryEvent> {
    const response = await authedFetch('/api/events/', {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
}

export async function updateEvent(id: number, eventData: Partial<DeliveryEvent>): Promise<DeliveryEvent> {
    const response = await authedFetch(`/api/events/${id}/`, {
        method: 'PATCH', // PATCH is for partial updates
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
}

export async function deleteEvent(id: number): Promise<void> {
    const response = await authedFetch(`/api/events/${id}/`, {
        method: 'DELETE',
    });
    await handleResponse(response);
}

export async function activateFreeEvent(eventId: number): Promise<DeliveryEvent> {
    const response = await authedFetch(`/api/events/${eventId}/activate/`, {
        method: 'POST',
    });
    return handleResponse(response);
}

export async function calculatePrice(payload: CalculatePricePayload): Promise<{ upfront_price: number; breakdown: PriceBreakdown }> {
  const response = await fetch('/api/events/calculate-price/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function getColors(): Promise<Color[]> {
    const response = await authedFetch('/api/events/colors/');
    return handleResponse(response);
}

export async function getFlowerTypes(): Promise<FlowerType[]> {
    const response = await authedFetch('/api/events/flower-types/');
    return handleResponse(response);
}
