import type { Order } from './Order';
import type { DeliveryEvent } from './DeliveryEvent';

export interface NextDeliveryInfo {
    plan: Order;
    event: DeliveryEvent;
    deliveryIndex: number;
}
