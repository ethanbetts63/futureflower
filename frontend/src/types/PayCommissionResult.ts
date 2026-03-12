export interface PayCommissionResult {
  status: string;
  stripe_transfer_id: string;
  payout_id: number;
}
