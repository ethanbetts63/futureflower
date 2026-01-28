export interface DecodedToken {
    exp: number;
}

export type PriceBreakdown = {
  fee_per_delivery: number;
  years: number;
  deliveries_per_year: number;
  upfront_savings_percentage: number;
  // include other properties if needed
};