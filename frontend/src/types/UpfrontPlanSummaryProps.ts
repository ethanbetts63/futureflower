import type { UpfrontPlan } from './UpfrontPlan';
import type { PartialUpfrontPlan } from './PartialUpfrontPlan';

export interface UpfrontPlanSummaryProps {
  plan: UpfrontPlan;
  newPlanDetails?: PartialUpfrontPlan & { amount: number };
}
