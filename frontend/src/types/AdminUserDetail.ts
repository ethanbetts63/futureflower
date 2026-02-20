import type { AdminUserPlan } from './AdminUserPlan';

export interface AdminUserDetail {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  stripe_customer_id: string | null;
  anonymized_at: string | null;
  is_partner: boolean;
  referred_by: string | null;
  plans: AdminUserPlan[];
}
