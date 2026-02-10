// foreverflower/frontend/src/components/UpfrontPlanSummary.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { UpfrontPlanSummaryProps } from '../types/UpfrontPlanSummaryProps';

const frequencyMap: { [key: string]: string } = {
    'weekly': 'Weekly',
    'fortnightly': 'Fortnightly',
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'bi-annually': 'Bi-Annually',
    'annually': 'Annually',
};

const UpfrontPlanSummary: React.FC<UpfrontPlanSummaryProps> = ({ plan, newPlanDetails }) => {
    const displayPlan = {
        years: newPlanDetails?.years ?? plan.years,
        frequency: newPlanDetails?.frequency ?? plan.frequency,
        budget: newPlanDetails?.budget ?? plan.budget,
    };

    const totalAmount = newPlanDetails?.amount ?? plan.total_amount;
    const title = newPlanDetails ? "Confirm Your Changes" : "Your Flower Plan";
    const description = newPlanDetails
        ? "Review the changes and your single-delivery payment."
        : "Review your single-delivery payment details below.";

  return (
    <Card className="bg-white shadow-md border-none text-black">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Plan Duration</span>
          <div className='flex items-center'>
            {newPlanDetails && newPlanDetails.years !== plan.years && <span className="text-gray-500 line-through mr-2">{plan.years} {plan.years > 1 ? 'Years' : 'Year'}</span>}
            <span>{displayPlan.years} {displayPlan.years > 1 ? 'Years' : 'Year'}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Delivery Frequency</span>
           <div className='flex items-center'>
            {newPlanDetails && newPlanDetails.frequency !== plan.frequency && <span className="text-gray-500 line-through mr-2">{frequencyMap[plan.frequency] || plan.frequency}</span>}
            <span>{frequencyMap[displayPlan.frequency] || displayPlan.frequency}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Budget per Bouquet</span>
           <div className='flex items-center'>
            {newPlanDetails && newPlanDetails.budget !== plan.budget && <span className="text-gray-500 line-through mr-2">${Number(plan.budget).toFixed(2)}</span>}
            <span>${Number(displayPlan.budget).toFixed(2)}</span>
          </div>
        </div>
        <div className="border-t my-2"></div>
        <div className="flex justify-between text-xl font-bold">
          <span>{newPlanDetails ? "Amount Due Today" : "Total Amount"}</span>
          <span>${Number(totalAmount).toFixed(2)} {plan.currency.toUpperCase()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpfrontPlanSummary;
