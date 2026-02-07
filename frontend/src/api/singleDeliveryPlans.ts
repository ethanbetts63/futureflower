import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { SingleDeliveryPlan, PartialSingleDeliveryPlan } from "@/types";

function parsePlan(plan: any): SingleDeliveryPlan {
    return {
        ...plan,
        total_amount: parseFloat(plan.total_amount),
        events: plan.events || [],
    };
}

export async function getSingleDeliveryPlan(planId: string): Promise<SingleDeliveryPlan> {
    const response = await authedFetch(`/api/events/single-delivery-plans/${planId}/`);
    const data = await handleResponse<any>(response);
    return parsePlan(data);
}

export async function getSingleDeliveryPlans(): Promise<SingleDeliveryPlan[]> {
    const response = await authedFetch('/api/events/single-delivery-plans/');
    const data = await handleResponse<any[]>(response);
    return data.map(parsePlan);
}

export async function getOrCreatePendingSingleDeliveryPlan(): Promise<SingleDeliveryPlan> {
    const response = await authedFetch('/api/events/single-delivery-plans/get-or-create-pending/');
    const data = await handleResponse<any>(response);
    return parsePlan(data);
}

export async function updateSingleDeliveryPlan(planId: string, planData: PartialSingleDeliveryPlan): Promise<SingleDeliveryPlan> {
    const response = await authedFetch(`/api/events/single-delivery-plans/${planId}/`, {
        method: 'PATCH',
        body: JSON.stringify(planData),
    });
    const data = await handleResponse<any>(response);
    return parsePlan(data);
}

export async function calculateSingleDeliveryPrice(planId: string, budget: number): Promise<{ total_amount: number }> {
  const response = await authedFetch(`/api/events/single-delivery-plans/${planId}/calculate-price/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ budget }),
  });
  return handleResponse(response);
}
