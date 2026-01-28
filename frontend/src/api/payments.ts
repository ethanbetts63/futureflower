
import { authedFetch } from './apiClient';
import { handleResponse } from './helpers';
import type { CreatePaymentIntentPayload } from "@/types";

export async function createPaymentIntent(payload: CreatePaymentIntentPayload): Promise<{ clientSecret: string }> {
  const response = await authedFetch('/api/payments/create-payment-intent/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}
