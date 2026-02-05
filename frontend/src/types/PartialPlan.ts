import type { PartialUpfrontPlan } from './PartialUpfrontPlan';
import type { PartialSubscriptionPlan } from './PartialSubscriptionPlan';
import type { PartialSingleDeliveryPlan } from './PartialSingleDeliveryPlan';

export type PartialPlan = PartialUpfrontPlan | PartialSubscriptionPlan | PartialSingleDeliveryPlan;
