import type { AdminPlanEvent } from './AdminPlanEvent';

export interface AdminPlanDetail {
  id: number;
  plan_type: 'upfront' | 'subscription';
  status: 'pending_payment' | 'active' | 'completed' | 'cancelled' | 'refunded';
  budget: string | null;
  total_amount: string | null;
  frequency: string | null;
  start_date: string | null;
  created_at: string;
  recipient_first_name: string | null;
  recipient_last_name: string | null;
  recipient_street_address: string | null;
  recipient_suburb: string | null;
  recipient_city: string | null;
  recipient_state: string | null;
  recipient_postcode: string | null;
  recipient_country: string | null;
  delivery_notes: string | null;
  preferred_delivery_time: string | null;
  preferred_flower_types: string[];
  flower_notes: string | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  years: number | null;
  subscription_message: string | null;
  events: AdminPlanEvent[];
}
