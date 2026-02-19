import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { SubscriptionPlan, PartialSubscriptionPlan } from "@/types";

export async function getOrCreatePendingSubscriptionPlan(): Promise<SubscriptionPlan> {
    const response = await authedFetch('/api/events/subscription-plans/get-or-create-pending/');
    return handleResponse(response);
}

export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlan> {
    const response = await authedFetch(`/api/events/subscription-plans/${planId}/`);
    return handleResponse(response);
}

export async function updateSubscriptionPlan(planId: string, planData: PartialSubscriptionPlan): Promise<SubscriptionPlan> {
    const response = await authedFetch(`/api/events/subscription-plans/${planId}/`, {
        method: 'PATCH',
        body: JSON.stringify(planData),
    });
    return handleResponse(response);
}

export async function calculateSubscriptionPrice(planId: string, budget: number): Promise<{ total_amount: number }> {
  const response = await authedFetch(`/api/events/subscription-plans/${planId}/calculate-price/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ budget }),
  });
  return handleResponse(response);
}

export async function createSubscription(payload: { subscription_plan_id: string }): Promise<{ clientSecret: string }> {
    const response = await authedFetch('/api/payments/create-subscription/', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await authedFetch('/api/events/subscription-plans/');
    return handleResponse(response);
}

export async function cancelSubscription(planId: string, cancelType: 'keep_current' | 'cancel_all'): Promise<void> {
    const response = await authedFetch(`/api/events/subscription-plans/${planId}/cancel/`, {
        method: 'POST',
        body: JSON.stringify({ cancel_type: cancelType }),
    });
    await handleResponse(response);
}
