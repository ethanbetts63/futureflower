import type { UpfrontPlan } from './UpfrontPlan';
import type { FlowerType } from './FlowerType';

export interface UpfrontSummaryProps {
  plan: UpfrontPlan;
  flowerTypeMap: Map<number, FlowerType>;
  context: 'ordering' | 'management';
  planId: string;
  onRefreshPlan?: () => void;
}
