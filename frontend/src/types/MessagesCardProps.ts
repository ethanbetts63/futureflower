import type { UpfrontPlan } from './UpfrontPlan';
import type { SubscriptionPlan } from './SubscriptionPlan';

export interface MessagesCardProps {
    plan: UpfrontPlan | SubscriptionPlan;
    editUrl: string;
}
