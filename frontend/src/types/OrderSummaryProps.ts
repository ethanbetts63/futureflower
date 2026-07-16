import type { Order } from './Order';
import type { FlowerType } from './FlowerType';

export interface OrderSummaryProps {
  plan: Order;
  flowerTypeMap: Map<number, FlowerType>;
  context: 'ordering' | 'management';
  onRefreshPlan?: () => void;
}
