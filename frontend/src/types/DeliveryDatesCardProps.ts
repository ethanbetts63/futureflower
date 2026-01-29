import type { UpfrontPlan } from './UpfrontPlan';
import type { SubscriptionPlan } from './SubscriptionPlan';

export interface DeliveryDatesCardProps {
    plan: UpfrontPlan | SubscriptionPlan;
    editUrl: string;
}
