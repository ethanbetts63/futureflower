import type { UpfrontPlan } from './UpfrontPlan';
import type { SingleDeliveryPlan } from './SingleDeliveryPlan';

export interface MessagesCardProps {
    plan: UpfrontPlan | SingleDeliveryPlan;
    editUrl: string;
}
