import type { UpfrontPlan } from './UpfrontPlan';
import type { SingleDeliveryPlan } from './SingleDeliveryPlan';
import type { DeliveryEvent } from './DeliveryEvent';

export interface NextDeliveryInfo {
    plan: UpfrontPlan | SingleDeliveryPlan;
    event: DeliveryEvent;
    deliveryIndex: number;
}
