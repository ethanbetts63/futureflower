import type { Order } from './Order';
import type { FlowerType } from './FlowerType';

export interface UpfrontSummaryProps {
  plan: Order;
  flowerTypeMap: Map<number, FlowerType>;
  context: 'ordering' | 'management';
  planId: string;
  onRefreshPlan?: () => void;
}
