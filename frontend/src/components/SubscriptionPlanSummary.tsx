// futureflower/frontend/src/components/SubscriptionPlanSummary.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { SubscriptionPlanSummaryProps } from '../types/SubscriptionPlanSummaryProps';

import type { Plan, SubscriptionPlan } from '../types';

const isSubscriptionPlan = (p: Plan): p is SubscriptionPlan => {
    return 'frequency' in p && 'price_per_delivery' in p;
};

const SubscriptionPlanSummary: React.FC<SubscriptionPlanSummaryProps> = ({ plan }) => {
    const title = "Your Subscription";
    const description = "Review your recurring payment details below.";
    
    const frequencyMap: { [key: string]: string } = {
        'monthly': 'Per Month',
        'quarterly': 'Per Quarter',
        'bi-annually': 'Per 6 Months',
        'annually': 'Per Year',
    };

    if (!isSubscriptionPlan(plan)) {
        return (
            <Card className="bg-white shadow-md border-none text-black">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-red-500">Error: Expected Subscription Plan but received a different type.</p>
                </CardContent>
            </Card>
        );
    }

  return (
    <Card className="bg-white shadow-md border-none text-black">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Budget per Bouquet</span>
          <span>${Number(plan.budget).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Frequency</span>
          <span className="capitalize">{plan.frequency}</span>
        </div>
        <div className="border-t my-2"></div>
        <div className="flex justify-between text-xl font-bold">
          <span>Amount Due Today</span>
          <span>${Number(plan.total_amount).toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground">
            You will be charged this amount {frequencyMap[plan.frequency || 'monthly']} starting today.
        </p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlanSummary;