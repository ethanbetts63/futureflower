export interface Payout {
  id: number;
  payout_type: 'fulfillment' | 'commission';
  amount: string;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  period_start: string | null;
  period_end: string | null;
  created_at: string;
}

export interface PayoutDetail extends Payout {
  stripe_transfer_id: string | null;
  note: string;
  line_items: PayoutLineItem[];
}

export interface PayoutLineItem {
  id: number;
  amount: string;
  description: string;
  created_at: string;
}
