import type { UpfrontPlan } from './UpfrontPlan';
import type { SubscriptionPlan } from './SubscriptionPlan';
import type { DeliveryEvent } from './DeliveryEvent';

export interface NextDeliveryInfo {
    plan: UpfrontPlan | SubscriptionPlan;
    event: DeliveryEvent;
    deliveryIndex: number;
}
