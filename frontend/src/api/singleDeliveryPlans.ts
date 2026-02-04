
import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { SingleDeliveryPlan, PartialSingleDeliveryPlan } from "@/types";

export async function getSingleDeliveryPlan(planId: string): Promise<SingleDeliveryPlan> {
    const response = await authedFetch(`/api/events/single-delivery-plans/${planId}/`);
    return handleResponse(response);
}

export async function getSingleDeliveryPlans(): Promise<SingleDeliveryPlan[]> {
    const response = await authedFetch('/api/events/single-delivery-plans/');
    return handleResponse(response);
}

export async function getOrCreatePendingSingleDeliveryPlan(): Promise<SingleDeliveryPlan> {
    const response = await authedFetch('/api/events/single-delivery-plans/get-or-create-pending/');
    return handleResponse(response);
}

export async function updateSingleDeliveryPlan(planId: string, planData: PartialSingleDeliveryPlan): Promise<SingleDeliveryPlan> {
    const response = await authedFetch(`/api/events/single-delivery-plans/${planId}/`, {
        method: 'PATCH',
        body: JSON.stringify(planData),
    });
    return handleResponse(response);
}

export async function calculateSingleDeliveryPrice(planId: string, budget: number): Promise<{ total_amount: number }> {
  const response = await authedFetch(`/api/events/single-delivery-plans/${planId}/calculate-price/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ budget }),
  });
  return handleResponse(response);
}
