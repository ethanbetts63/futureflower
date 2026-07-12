import type { Order } from './Order';
import type { FlowerType } from './FlowerType';

export interface SubscriptionSummaryProps {
  plan: Order;
  flowerTypeMap: Map<number, FlowerType>;
  planId: string;
}
