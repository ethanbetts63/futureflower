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
