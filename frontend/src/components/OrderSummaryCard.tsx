// foreverflower/frontend/src/components/OrderSummaryCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { getSubscriptionPlan } from '@/api/subscriptionPlans';
import { getUpfrontPlan } from '@/api/upfrontPlans';
import type { SubscriptionPlan, UpfrontPlan } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Flower, Calendar, Repeat, DollarSign } from 'lucide-react';

interface OrderSummaryCardProps {
    planId: string;
    itemType: 'SUBSCRIPTION_PLAN_NEW' | 'UPFRONT_PLAN_NEW' | string;
}

type Plan = SubscriptionPlan | UpfrontPlan;

const isSubscriptionPlan = (plan: Plan): plan is SubscriptionPlan => {
    return 'frequency' in plan;
};

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
            <Card className="bg-white text-black border-none shadow-md w-full">
                <CardContent className="flex justify-center items-center p-8">
                    <Spinner />
                </CardContent>
            </Card>
        );
    }

    if (error || !plan) {
        return (
            <Card className="bg-white text-black border-none shadow-md w-full">
                <CardHeader>
                    <CardTitle className="text-red-500">Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error || 'Could not display order summary.'}</p>
                </CardContent>
            </Card>
        );
    }

    const planIsSubscription = isSubscriptionPlan(plan);
    const totalPrice = planIsSubscription ? plan.price_per_delivery : plan.total_amount;
    const planType = planIsSubscription ? 'Subscription' : 'Upfront Plan';
    const capitalizedFrequency = planIsSubscription ? plan.frequency.charAt(0).toUpperCase() + plan.frequency.slice(1) : null;

    return (
        <Card className="bg-white text-black border-none shadow-md w-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{planIsSubscription ? 'Subscription Details' : 'Order Summary'}</span>
                    <Badge variant="secondary">{planType}</Badge>
                </CardTitle>
                <CardDescription>Review the details of your order before completing payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                    {planIsSubscription && (
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center"><Repeat className="mr-2 h-4 w-4" />Delivery Frequency</span>
                        <span>{capitalizedFrequency}</span>
                    </div>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center"><Flower className="mr-2 h-4 w-4" />Flower Budget</span>
                        <span>${Number(plan.budget).toFixed(2)}</span>
                    </div>
                    {!planIsSubscription && 'years' in plan && (
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center"><Calendar className="mr-2 h-4 w-4" />Duration</span>
                            <span>{plan.years} {plan.years > 1 ? 'Years' : 'Year'}</span>
                        </div>
                    )}
                </div>
                {planIsSubscription && (
                    <>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center"><DollarSign className="mr-2 h-4 w-4" />Handling</span>
                            <span>${(Number(plan.price_per_delivery) - Number(plan.budget)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span className="flex items-center"><DollarSign className="mr-2 h-5 w-5" />Total Per Delivery</span>
                            <span>${Number(plan.price_per_delivery).toFixed(2)}</span>
                        </div>
                    </>
                )}
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex justify-between items-center text-xl font-bold">
                    <span className="flex items-center"><DollarSign className="mr-2 h-5 w-5" />Amount Due Today</span>
                    <span>{planIsSubscription ? '$0.00' : `$${Number(totalPrice).toFixed(2)}`}</span>
                </div>
                {planIsSubscription && plan.next_payment_date && (
                    <div className="text-sm text-center text-muted-foreground mt-2">
                        Your first payment of ${Number(plan.price_per_delivery).toFixed(2)} will be charged on {new Date(plan.next_payment_date).toLocaleDateString()}.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderSummaryCard;
