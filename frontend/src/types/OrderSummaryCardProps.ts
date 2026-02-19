export interface OrderSummaryCardProps {
    planId: string;
    itemType: 'SUBSCRIPTION_PLAN_NEW' | 'UPFRONT_PLAN_NEW' | 'SINGLE_DELIVERY_PLAN_NEW' | string;
}
