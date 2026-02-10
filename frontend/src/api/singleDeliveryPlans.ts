import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { UpfrontPlan, PartialUpfrontPlan } from "@/types";

function parseUpfrontPlan(plan: any): UpfrontPlan {
    return {
        ...plan,
        total_amount: parseFloat(plan.total_amount),
        events: plan.events || [],
    } as UpfrontPlan;
}

export async function getUpfrontPlanAsSingleDelivery(planId: string): Promise<UpfrontPlan> {
    const response = await authedFetch(`/api/events/upfront-plans/${planId}/`);
    const data = await handleResponse<any>(response);
    return parseUpfrontPlan(data);
}

export async function getSingleDeliveryTypeUpfrontPlans(): Promise<UpfrontPlan[]> {
    const response = await authedFetch('/api/events/upfront-plans/?years=1&deliveries_per_year=1');
    const data = await handleResponse<any[]>(response);
    return data.map(parseUpfrontPlan);
}

export async function getOrCreatePendingSingleDeliveryTypeUpfrontPlan(): Promise<UpfrontPlan> {
    const response = await authedFetch('/api/events/upfront-plans/get-or-create-pending/?mode=single-delivery');
    const data = await handleResponse<any>(response);
    return parseUpfrontPlan(data);
}

export async function updateUpfrontPlanAsSingleDelivery(planId: string, planData: PartialUpfrontPlan): Promise<UpfrontPlan> {
    const response = await authedFetch(`/api/events/upfront-plans/${planId}/`, {
        method: 'PATCH',
        body: JSON.stringify(planData),
    });
    const data = await handleResponse<any>(response);
    return parseUpfrontPlan(data);
}

interface CalculatedPriceResponse {
  new_total_price: number;
  total_paid: number;
  amount_owing: number;
}

export async function calculateUpfrontPlanSingleDeliveryPrice(planId: string, budget: number): Promise<CalculatedPriceResponse> {
  const response = await authedFetch(`/api/events/upfront-plans/${planId}/calc-upfront-price/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ budget, deliveries_per_year: 1, years: 1 }),
  });
  return handleResponse(response);
}
