import type { Order } from './Order';

export interface RecipientSummaryProps {
  plan: Order;
  editUrl?: string;
  locked?: boolean;
}
