import type { UpfrontPlan } from './UpfrontPlan';
import type { SubscriptionPlan } from './SubscriptionPlan';
import type { SingleDeliveryPlan } from './SingleDeliveryPlan';

export type Plan = UpfrontPlan | SubscriptionPlan | SingleDeliveryPlan;
