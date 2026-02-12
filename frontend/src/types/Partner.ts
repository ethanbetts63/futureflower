export interface Partner {
  id: number;
  partner_type: 'non_delivery' | 'delivery';
  status: 'pending' | 'active' | 'suspended';
  business_name: string;
  phone: string;
  booking_slug: string | null;
  discount_code: DiscountCode | null;
  commission_summary: CommissionSummary;
  recent_commissions: Commission[];
  service_areas: ServiceArea[];
  delivery_requests: DeliveryRequestSummary[];
  stripe_connect_onboarding_complete: boolean;
  payout_summary: PayoutSummary;
  created_at: string;
}

export interface DiscountCode {
  code: string;
  discount_amount: string;
  is_active: boolean;
  total_uses: number;
  created_at: string;
}

export interface CommissionSummary {
  total_earned: string;
  total_pending: string;
  total_approved: string;
  total_paid: string;
}

export interface Commission {
  id: number;
  commission_type: 'referral' | 'fulfillment';
  amount: string;
  status: 'pending' | 'approved' | 'paid';
  note: string;
  created_at: string;
}

export interface ServiceArea {
  id: number;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  is_active: boolean;
}

export interface DeliveryRequestSummary {
  id: number;
  event_id: number;
  delivery_date: string;
  recipient_name: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
  expires_at: string;
  created_at: string;
}

export interface PayoutSummary {
  total_paid: string;
  total_pending: string;
}

export interface DiscountCodeValidation {
  code: string;
  discount_amount: string;
  partner_name: string;
}

export type DiscountValidationResult = DiscountCodeValidation;

export type ServiceAreaInput = {
  suburb: string;
  city: string;
  state?: string;
  postcode?: string;
  country: string;
};

export interface PartnerRegistrationData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  business_name?: string;
  phone?: string;
  partner_type: 'non_delivery' | 'delivery';
  booking_slug?: string;
  street_address?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  service_areas?: {
    suburb: string;
    city: string;
    state?: string;
    postcode?: string;
    country: string;
  }[];
}
