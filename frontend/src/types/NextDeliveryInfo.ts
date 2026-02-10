import type { UpfrontPlan } from './UpfrontPlan';
import type { DeliveryEvent } from './DeliveryEvent';

export interface NextDeliveryInfo {
    plan: UpfrontPlan;
    event: DeliveryEvent;
    deliveryIndex: number;
}
