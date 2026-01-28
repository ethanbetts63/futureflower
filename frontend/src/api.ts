// src/api.ts
import { authedFetch } from '@/apiClient';
import type { AppConfig, AuthResponse, Event, UserProfile, FaqItem, TermsAndConditions, Color, FlowerType, UpfrontPlan, CreateUpfrontPlanPayload, PartialUpfrontPlan, CreatePaymentIntentPayload } from "@/types";
import type { ProfileCreationData } from "@/forms/ProfileCreationForm";

/**
 * A centralized module for all API interactions.
 */

// --- Helper Functions ---

/**
 * A helper function to handle common API response logic.
 * It handles JSON parsing and throws a structured error on failure.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Handle successful but empty responses (e.g., from a DELETE request)
  if (response.status === 204) {
    return Promise.resolve(null as T);
  }

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.detail || 'An unknown API error occurred.');
    (error as any).data = data; // Attach the full error data for more specific handling
    throw error;
  }
  return data as T;
}


// --- Configuration Endpoints ---

export async function getAppConfig(): Promise<AppConfig> {
  const response = await fetch('/api/products/single-event-price/');
  return handleResponse(response);
}


// --- Auth & Registration Endpoints ---

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });
  return handleResponse(response);
}

export async function registerUser(userData: ProfileCreationData): Promise<AuthResponse> {
  const response = await fetch('/api/users/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function claimAccount(password: string): Promise<{ detail: string }> {
  const response = await authedFetch('/api/users/claim/', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  return handleResponse(response);
}

// --- Legal Endpoints ---

export async function getLatestTermsAndConditions(): Promise<TermsAndConditions> {
    const response = await fetch('/api/data/terms/latest/');
    return handleResponse(response);
}


// --- FAQ Endpoint ---

export async function getFaqs(page: string): Promise<FaqItem[]> {
    const response = await authedFetch(`/api/data/faqs/?page=${page}`, {
        method: 'GET',
    });
    return handleResponse(response);
}

// --- Event Endpoints ---

export async function getEvents(): Promise<Event[]> {
    const response = await authedFetch('/api/events/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function getEvent(id: string): Promise<Event> {
    const response = await authedFetch(`/api/events/${id}/`, {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function createAuthenticatedEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await authedFetch('/api/events/', {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
}

export async function updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
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

export async function activateFreeEvent(eventId: number): Promise<Event> {
    const response = await authedFetch(`/api/events/${eventId}/activate/`, {
        method: 'POST',
    });
    return handleResponse(response);
}

// --- UpfrontPlan Endpoints ---







export async function getColors(): Promise<Color[]> {
    const response = await authedFetch('/api/events/colors/');
    return handleResponse(response);
}

export async function getFlowerTypes(): Promise<FlowerType[]> {
    const response = await authedFetch('/api/events/flower-types/');
    return handleResponse(response);
}

export async function getUpfrontPlan(planId: string): Promise<UpfrontPlan> {
    const response = await authedFetch(`/api/events/upfront-plans/${planId}/`);
    return handleResponse(response);
}

export async function getUpfrontPlans(): Promise<UpfrontPlan[]> {
    const response = await authedFetch('/api/events/upfront-plans/');
    return handleResponse(response);
}

export async function getOrCreatePendingUpfrontPlan(): Promise<UpfrontPlan> {
    const response = await authedFetch('/api/events/upfront-plans/get-or-create-pending');
    return handleResponse(response);
}

export async function deleteUpfrontPlan(planId: string): Promise<void> {
    const response = await authedFetch(`/api/events/upfront-plans/${planId}/`, {
        method: 'DELETE',
    });
    await handleResponse(response);
}



export async function createUpfrontPlan(planData: CreateUpfrontPlanPayload): Promise<UpfrontPlan> {
    const response = await authedFetch('/api/events/upfront-plans/', {
        method: 'POST',
        body: JSON.stringify(planData),
    });
    return handleResponse(response);
}



export async function updateUpfrontPlan(planId: string, planData: PartialUpfrontPlan): Promise<UpfrontPlan> {
    const response = await authedFetch(`/api/events/upfront-plans/${planId}/`, {
        method: 'PATCH',
        body: JSON.stringify(planData),
    });
    return handleResponse(response);
}



// --- User Profile & Settings Endpoints ---

export async function getDashboardAnalytics(): Promise<any[]> {
    const response = await authedFetch('/api/data/analytics/dashboard/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function getUserProfile(): Promise<UserProfile> {
    const response = await authedFetch('/api/users/me/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await authedFetch('/api/users/me/', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
    });
    return handleResponse(response);
}



export async function changePassword(passwordData: { old_password: string, new_password: string, new_password_confirm: string }): Promise<{ detail: string }> {
  const response = await authedFetch('/api/users/change-password/', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
  return handleResponse(response);
}

// --- Payment Endpoints ---



export async function createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<{ clientSecret: string }> {
  const response = await authedFetch('/api/payments/create-payment-intent/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function deleteAccount(): Promise<void> {
  const response = await authedFetch('/api/users/delete/', {
    method: 'DELETE',
  });
  await handleResponse(response);
}