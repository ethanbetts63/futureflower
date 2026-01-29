import type { UpfrontPlan } from './UpfrontPlan';

export interface UpfrontPlanTableProps {
  showTitle?: boolean; // Optional prop to show/hide the title within the component
  initialPlans?: UpfrontPlan[]; // Optional prop to provide initial plans, if not fetching internally
}
