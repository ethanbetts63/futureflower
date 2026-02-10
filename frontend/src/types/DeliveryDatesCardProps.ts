import type { UpfrontPlan } from './UpfrontPlan';
import type { SingleDeliveryPlan } from './SingleDeliveryPlan';

export interface DeliveryDatesCardProps {
    plan: UpfrontPlan | SingleDeliveryPlan;
    editUrl: string;
}
