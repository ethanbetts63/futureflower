import type { DeliveryEvent } from './DeliveryEvent';
import type { Payment } from './Payment';

export type BillingMode = 'one_time' | 'recurring';

export interface Order {
  id: number;
  user: number;
  status: string;
  billing_mode: BillingMode | null;
  currency: string;

  recipient_first_name: string | null;
  recipient_last_name: string | null;
  recipient_street_address: string | null;
  recipient_suburb: string | null;
  recipient_city: string | null;
  recipient_state: string | null;
  recipient_postcode: string | null;
  recipient_country: string | null;

  budget: number | null;
  /** Server-computed. Zero once the budget reaches the delivery-included threshold. */
  delivery_fee: number;
  subtotal: number;
  discount_amount: number;
  total_amount: number | null;
  discount_code_display: string | null;

  frequency: string | null;
  occasion: string | null;
  start_date: string | null;
  delivery_notes: string | null;
  preferred_delivery_time: string | null;

  flower_notes: string | null;
  /** One-off deliveries only — subscriptions are delivered without a card message. */
  card_message: string | null;

  stripe_subscription_id: string | null;
  next_payment_date: string | null;
  next_delivery_date: string | null;

  created_at: string;
  updated_at: string;
  events: DeliveryEvent[];
  payments: Payment[];

  /** Guest-checkout GET only: contact details captured by claim(), empty until then. */
  customer_email?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  /** Guest-checkout GET only: whether the current customer terms are already accepted. */
  terms_accepted?: boolean;
}

export type PartialOrder = Partial<Order>;
