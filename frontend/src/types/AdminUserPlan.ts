export interface AdminUserPlan {
  id: number;
  plan_type: 'upfront' | 'subscription';
  status: string;
  total_amount: string | null;
  created_at: string;
  recipient_first_name: string | null;
  recipient_last_name: string | null;
}
