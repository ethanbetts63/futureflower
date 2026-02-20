export interface AdminEvent {
  id: number;
  delivery_date: string;
  status: 'scheduled' | 'ordered' | 'delivered' | 'cancelled';
  message: string | null;
  ordered_at: string | null;
  ordering_evidence_text: string | null;
  delivered_at: string | null;
  delivery_evidence_text: string | null;
  // Order fields
  order_id: number;
  order_type: string;
  budget: string;
  total_amount: string;
  frequency: string | null;
  start_date: string | null;
  preferred_delivery_time: string | null;
  delivery_notes: string | null;
  // Recipient
  recipient_first_name: string;
  recipient_last_name: string;
  recipient_street_address: string;
  recipient_suburb: string;
  recipient_city: string;
  recipient_state: string;
  recipient_postcode: string;
  recipient_country: string;
  // Preferences
  flower_notes: string | null;
  preferred_flower_types: string[];
  // Customer
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
}

export interface AdminDashboard {
  to_order: AdminEvent[];
  ordered: AdminEvent[];
  delivered: AdminEvent[];
}

export interface AdminPartner {
  id: number;
  business_name: string;
  partner_type: 'non_delivery' | 'delivery';
  status: 'pending' | 'active' | 'suspended' | 'denied';
  phone: string;
  street_address: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  service_radius_km: number;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AdminPlan {
  id: number;
  plan_type: 'upfront' | 'subscription';
  status: 'pending_payment' | 'active' | 'completed' | 'cancelled' | 'refunded';
  budget: string;
  total_amount: string;
  frequency: string | null;
  start_date: string | null;
  created_at: string;
  recipient_first_name: string | null;
  recipient_last_name: string | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
}

export interface AdminPlanEvent {
  id: number;
  delivery_date: string;
  status: 'scheduled' | 'ordered' | 'delivered' | 'cancelled';
}

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

export interface MarkOrderedPayload {
  ordered_at: string;
  ordering_evidence_text: string;
}

export interface MarkDeliveredPayload {
  delivered_at: string;
  delivery_evidence_text: string;
}
