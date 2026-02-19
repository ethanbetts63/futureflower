import type { SubscriptionPlan } from './SubscriptionPlan';
import type { FlowerType } from './FlowerType';

export interface SubscriptionSummaryProps {
  plan: SubscriptionPlan;
  flowerTypeMap: Map<number, FlowerType>;
  context: 'ordering' | 'management';
  planId: string;
  onRefreshPlan?: () => void;
}
