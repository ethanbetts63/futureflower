import type { DeliveryEvent } from './DeliveryEvent';
import type { Payment } from './Payment';

export type BillingMode = 'one_time' | 'recurring' | 'prepaid';

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
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number | null;
  discount_code_display: string | null;

  frequency: string | null;
  start_date: string | null;
  years: number | null;
  delivery_notes: string | null;
  preferred_delivery_time: string | null;

  preferred_flower_types: number[];
  flower_notes: string | null;
  recurring_preferences: string | null;
  draft_card_messages: Record<string, string>;

  stripe_subscription_id: string | null;
  subscription_message: string | null;
  next_payment_date: string | null;
  next_delivery_date: string | null;

  created_at: string;
  updated_at: string;
  events: DeliveryEvent[];
  payments: Payment[];
}

export type PartialOrder = Partial<Order>;
