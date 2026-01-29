
import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { UpfrontPlan, CreateUpfrontPlanPayload, PartialUpfrontPlan } from "@/types";
import type { CalculatePlanPayload } from '../types/CalculatePlanPayload';

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

export async function calculateUpfrontPriceForPlan(planId: string, payload: CalculatePlanPayload): Promise<{ amount_owing: number }> {
  const response = await authedFetch(`/api/events/upfront-plans/${planId}/calc-upfront-price/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}
