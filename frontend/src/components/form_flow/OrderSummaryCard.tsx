// futureflower/frontend/src/components/OrderSummaryCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { getSubscriptionPlan } from '@/api/subscriptionPlans';
import { getUpfrontPlan } from '@/api/upfrontPlans';
import { getUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';
import type { SubscriptionPlan, UpfrontPlan } from '@/types'; 
import { Badge } from '@/components/ui/badge';
import { Flower, Calendar, Repeat, DollarSign } from 'lucide-react';

interface OrderSummaryCardProps {
    planId: string;
    itemType: 'SUBSCRIPTION_PLAN_NEW' | 'UPFRONT_PLAN_NEW' | 'SINGLE_DELIVERY_PLAN_NEW' | string;
}

type Plan = SubscriptionPlan | UpfrontPlan; 
const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ planId, itemType }) => {
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setIsLoading(true);
                let fetchedPlan: Plan;
                if (itemType === 'SUBSCRIPTION_PLAN_NEW') {
                    fetchedPlan = await getSubscriptionPlan(planId);
                } else if (itemType === 'UPFRONT_PLAN_NEW') {
                    fetchedPlan = await getUpfrontPlan(planId);
                } else if (itemType === 'SINGLE_DELIVERY_PLAN_NEW') {
                    fetchedPlan = await getUpfrontPlanAsSingleDelivery(planId); 
                } else {
                    throw new Error(`Invalid itemType: ${itemType}`);
                }
                setPlan(fetchedPlan);
            } catch (err) {
                setError('Could not load order summary. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (planId && itemType) {
            fetchPlan();
        }
    }, [planId, itemType]);

    if (isLoading) {
        return (
            <Card className="bg-white text-black border-none shadow-none md:shadow-md w-full rounded-none md:rounded-xl">
                <CardContent className="flex justify-center items-center p-8">
                    <Spinner />
                </CardContent>
            </Card>
        );
    }

    if (error || !plan) {
        return (
            <Card className="bg-white text-black border-none shadow-none md:shadow-md w-full rounded-none md:rounded-xl">
                <CardHeader className="px-4 md:px-8">
                    <CardTitle className="text-red-500">Error</CardTitle>
                </CardHeader>
                <CardContent className="px-4 md:px-8 pb-10">
                    <p>{error || 'Could not display order summary.'}</p>
                </CardContent>
            </Card>
        );
    }

    const planIsSubscription = 'stripe_subscription_id' in plan || !('years' in plan);
    const planIsUpfront = 'years' in plan;

    // A single delivery plan is an upfront plan with 1 year and annually frequency
    const planIsSingleDelivery = planIsUpfront && (plan as UpfrontPlan).years === 1 && plan.frequency === 'annually';

    const totalPlanAmount = Number(plan.total_amount);
    const flowerBudget = Number(plan.budget);
    
    // Let's use a more robust way to get total deliveries for upfront
    const deliveriesPerYear = {
        'weekly': 52,
        'fortnightly': 26,
        'monthly': 12,
        'quarterly': 4,
        'bi-annually': 2,
        'annually': 1,
    }[plan.frequency?.toLowerCase() || 'annually'] || 1;

    const totalDeliveries = planIsUpfront ? ((plan as UpfrontPlan).years * deliveriesPerYear) : 1;
    const totalFlowerValue = flowerBudget * totalDeliveries;
    const totalServiceFee = totalPlanAmount - totalFlowerValue;

    const planType = planIsSubscription ? 'Subscription' : (planIsSingleDelivery ? 'Single Delivery' : 'Upfront Plan');
    const capitalizedFrequency = plan.frequency ? plan.frequency.charAt(0).toUpperCase() + plan.frequency.slice(1) : null;

    return (
        <Card className="bg-white text-black border-t md:border-none border-black/5 shadow-none md:shadow-md w-full rounded-none md:rounded-xl overflow-hidden">
            <CardHeader className="px-4 md:px-8 pt-6 md:pt-10">
                <CardTitle className="flex justify-between items-center">
                    <span>{planIsSubscription ? 'Subscription Details' : (planIsSingleDelivery ? 'Single Delivery Details' : 'Order Summary')}</span>
                    <Badge variant="secondary">{planType}</Badge>
                </CardTitle>
                <CardDescription>Review the details of your order before completing payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 md:px-8 pb-10">
                <div className="space-y-2 text-sm">
                    {planIsSubscription && (
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center"><Repeat className="mr-2 h-4 w-4" />Delivery Frequency</span>
                        <span>{capitalizedFrequency}</span>
                    </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center"><Flower className="mr-2 h-4 w-4" />Flower Budget</span>
                        <span>${flowerBudget.toFixed(2)} {planIsUpfront && `(x${totalDeliveries} deliveries)`}</span>
                    </div>
                    {!planIsSingleDelivery && !planIsSubscription && (
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center"><Calendar className="mr-2 h-4 w-4" />Duration</span>
                            <span>{(plan as UpfrontPlan).years} {(plan as UpfrontPlan).years > 1 ? 'Years' : 'Year'}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center"><Calendar className="mr-2 h-4 w-4" />Delivery</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center"><DollarSign className="mr-2 h-4 w-4" />Customer Refund Protection</span>
                        <span>${totalServiceFee.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex justify-between items-center text-xl font-bold">
                    <span className="flex items-center"><DollarSign className="mr-2 h-5 w-5" />{planIsSubscription ? 'Total Per Delivery' : 'Amount Due Today'}</span>
                    <span>${totalPlanAmount.toFixed(2)}</span>
                </div>
                
                {planIsSubscription && (
                    <div className="flex justify-between items-center text-sm font-medium mt-4 pt-4 border-t border-dashed border-gray-200">
                        <span>Amount Due Today</span>
                        <span>$0.00</span>
                    </div>
                )}

                {planIsSubscription && (plan as SubscriptionPlan).next_payment_date && (
                    <div className="text-sm text-center text-muted-foreground mt-2">
                        Your first payment of ${totalPlanAmount.toFixed(2)} will be charged on {new Date((plan as SubscriptionPlan).next_payment_date!).toLocaleDateString()}.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderSummaryCard;
