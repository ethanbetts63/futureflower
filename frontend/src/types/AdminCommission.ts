export interface AdminCommission {
  id: number;
  commission_type: 'referral' | 'fulfillment';
  amount: string;
  status: 'pending' | 'approved' | 'paid';
  note: string;
  created_at: string;
  event: number | null;
}
