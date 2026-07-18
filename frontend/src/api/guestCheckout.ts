import { getCsrfToken } from '@/utils/utils';
import { handleResponse } from './helpers';
import { parseOrder } from './parseOrder';
import type { DiscountValidationResult, Order, PartialOrder } from '@/types';
import { briefToOrderPatch, type HomepageBrief } from '@/lib/homepageBrief';

async function request<T = unknown>(action: string, body?: unknown, method = 'POST'): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const csrf = getCsrfToken();
  if (csrf) headers['X-CSRFToken'] = csrf;
  const response = await fetch(`/api/events/guest-checkout/${action}/`, {
    method, credentials: 'include', headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return handleResponse<T>(response);
}

export async function startGuestCheckout(brief: HomepageBrief): Promise<Order> {
  return parseOrder(await request('start', { brief: briefToOrderPatch(brief) }));
}

// The guest endpoints take no order id: the httponly checkout cookie authorizes
// exactly one draft order, and the server resolves it from that alone.
export async function getGuestOrder(): Promise<Order> {
  return parseOrder(await request('order', undefined, 'GET'));
}

export async function updateGuestOrder(data: PartialOrder): Promise<Order> {
  return parseOrder(await request('order', data));
}

export async function claimGuestCheckout(data: { email: string; first_name: string; last_name: string }): Promise<Order> {
  return parseOrder(await request('claim', data));
}

export async function makeGuestOrderRecurring(payload: { frequency: string }): Promise<Order> {
  return parseOrder(await request('make-recurring', payload));
}

// Pass an empty code to clear the discount.
export async function applyGuestDiscount(code: string): Promise<DiscountValidationResult> {
  return request<DiscountValidationResult>('discount', { code });
}

export async function startGuestCheckoutPayment(): Promise<{ clientSecret: string }> {
  return request<{ clientSecret: string }>('checkout');
}

export async function acceptGuestTerms(): Promise<void> {
  await request('accept-terms');
}
