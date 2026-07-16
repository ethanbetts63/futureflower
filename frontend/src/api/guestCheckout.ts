import { getCsrfToken } from '@/utils/utils';
import { handleResponse } from './helpers';
import type { Order, PartialOrder } from '@/types/Order';
import { briefToOrderPatch, type HomepageBrief } from '@/lib/homepageBrief';

function parseOrder(order: any): Order {
  return {
    ...order,
    budget: order.budget !== null && order.budget !== undefined ? Number(order.budget) : null,
    subtotal: Number(order.subtotal ?? 0),
    discount_amount: Number(order.discount_amount ?? 0),
    tax_amount: Number(order.tax_amount ?? 0),
    total_amount: order.total_amount !== null && order.total_amount !== undefined ? Number(order.total_amount) : null,
    events: order.events || [], payments: order.payments || [], draft_card_messages: order.draft_card_messages || {},
  } as Order;
}

async function request(action: string, body?: unknown, method = 'POST') {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const csrf = getCsrfToken();
  if (csrf) headers['X-CSRFToken'] = csrf;
  const response = await fetch(`/api/events/guest-checkout/${action}/`, {
    method, credentials: 'include', headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return handleResponse<any>(response);
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

export async function makeGuestOrderRecurring(payload: { frequency: string; recurring_preferences?: string; subscription_message?: string }): Promise<Order> {
  return parseOrder(await request('make-recurring', payload));
}

export async function startGuestCheckoutPayment(): Promise<{ clientSecret: string }> {
  return request('checkout');
}

export async function acceptGuestTerms(): Promise<void> {
  await request('accept-terms');
}
