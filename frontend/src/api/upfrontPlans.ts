
import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { UpfrontPlan, CreateUpfrontPlanPayload, PartialUpfrontPlan } from "@/types";
import type { CalculatePlanPayload } from '../types/CalculatePlanPayload';

export async function getUpfrontPlan(planId: string): Promise<UpfrontPlan> {
    const response = await authedFetch(`/api/events/upfront-plans/${planId}/`);
    return handleResponse(response);
}

export async function getUpfrontPlans(excludeSingleDelivery = false): Promise<UpfrontPlan[]> {
    const query = excludeSingleDelivery ? '?exclude_single_delivery=true' : '';
    const response = await authedFetch(`/api/events/upfront-plans/${query}`);
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

export interface ProjectedDelivery {
    index: number;
    date: string;
}

export async function getProjectedDeliveries(planId: string): Promise<ProjectedDelivery[]> {
    const response = await authedFetch(`/api/events/upfront-plans/${planId}/projected-deliveries/`);
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

export async function cancelUpfrontPlan(planId: string): Promise<void> {
  const response = await authedFetch(`/api/events/upfront-plans/${planId}/cancel/`, {
    method: 'POST',
  });
  await handleResponse(response);
}
