export interface CommissionActionResult {
  status: string;
  stripe_transfer_id?: string;
  payout_id?: number;
}
