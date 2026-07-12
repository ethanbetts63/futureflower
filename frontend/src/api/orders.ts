import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { Order, PartialOrder } from '@/types/Order';

type MakeRecurringPayload = {
  frequency: string;
  recurring_preferences?: string;
  subscription_message?: string;
};

function parseOrder(order: any): Order {
  return {
    ...order,
    budget: order.budget !== null && order.budget !== undefined ? Number(order.budget) : null,
    subtotal: Number(order.subtotal ?? 0),
    discount_amount: Number(order.discount_amount ?? 0),
    tax_amount: Number(order.tax_amount ?? 0),
    total_amount: order.total_amount !== null && order.total_amount !== undefined ? Number(order.total_amount) : null,
    events: order.events || [],
    payments: order.payments || [],
    draft_card_messages: order.draft_card_messages || {},
  } as Order;
}

export async function getOrders(): Promise<Order[]> {
  const response = await authedFetch('/api/events/orders/');
  const data = await handleResponse<any[]>(response);
  return data.map(parseOrder);
}

export async function getOrder(orderId: string): Promise<Order> {
  const response = await authedFetch(`/api/events/orders/${orderId}/`);
  const data = await handleResponse<any>(response);
  return parseOrder(data);
}

export async function getOrCreateDraftOrder(): Promise<Order> {
  const response = await authedFetch('/api/events/orders/get-or-create-draft/');
  const data = await handleResponse<any>(response);
  return parseOrder(data);
}

export async function updateOrder(orderId: string, orderData: PartialOrder): Promise<Order> {
  const response = await authedFetch(`/api/events/orders/${orderId}/`, {
    method: 'PATCH',
    body: JSON.stringify(orderData),
  });
  const data = await handleResponse<any>(response);
  return parseOrder(data);
}

export async function makeOrderRecurring(orderId: string, payload: MakeRecurringPayload): Promise<Order> {
  const response = await authedFetch(`/api/events/orders/${orderId}/make-recurring/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<any>(response);
  return parseOrder(data);
}

export async function startCheckout(orderId: string | number): Promise<{ clientSecret: string }> {
  const response = await authedFetch(`/api/events/orders/${orderId}/checkout/`, {
    method: 'POST',
  });
  return handleResponse(response);
}

export async function cancelOrder(
  orderId: string | number,
  options?: { cancel_type?: 'keep_current' | 'cancel_all' }
): Promise<{ status: string }> {
  const response = await authedFetch(`/api/events/orders/${orderId}/cancel/`, {
    method: 'POST',
    body: JSON.stringify(options || {}),
  });
  return handleResponse(response);
}
