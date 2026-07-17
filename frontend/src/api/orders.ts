import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import { parseOrder } from './parseOrder';
import type { Order, PartialOrder } from '@/types/Order';

type MakeRecurringPayload = {
  frequency: string;
  recurring_preferences?: string;
};

export async function getOrders(): Promise<Order[]> {
  const response = await authedFetch('/api/events/orders/');
  const data = await handleResponse<unknown[]>(response);
  return data.map(parseOrder);
}

export async function getOrder(orderId: string): Promise<Order> {
  const response = await authedFetch(`/api/events/orders/${orderId}/`);
  return parseOrder(await handleResponse<unknown>(response));
}

export async function updateOrder(orderId: string, orderData: PartialOrder): Promise<Order> {
  const response = await authedFetch(`/api/events/orders/${orderId}/`, {
    method: 'PATCH',
    body: JSON.stringify(orderData),
  });
  return parseOrder(await handleResponse<unknown>(response));
}

export async function makeOrderRecurring(orderId: string, payload: MakeRecurringPayload): Promise<Order> {
  const response = await authedFetch(`/api/events/orders/${orderId}/make-recurring/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return parseOrder(await handleResponse<unknown>(response));
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
