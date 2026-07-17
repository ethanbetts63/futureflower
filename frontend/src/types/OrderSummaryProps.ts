import type { Order } from './Order';

export interface OrderSummaryProps {
  plan: Order;
  context: 'ordering' | 'management';
  onRefreshPlan?: () => void;
}
