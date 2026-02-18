// futureflower/frontend/src/pages/subscription_flow/Step5ConfirmationPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Seo from '@/components/Seo';
import PlanDisplay from '@/components/PlanDisplay';
import SubscriptionSummary from '@/components/SubscriptionSummary';
import { getSubscriptionPlan } from '@/api';
import type { SubscriptionPlan } from '@/types/SubscriptionPlan';
import type { Plan } from '../../types/Plan';
import type { FlowerType } from '../../types/FlowerType';

const Step5ConfirmationPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();

  const isSubscriptionPlan = (plan: any): plan is SubscriptionPlan => {
    return 'stripe_subscription_id' in plan || 'subscription_message' in plan;
  };

  return (
    <>
      <Seo title="Confirm Your Subscription | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getSubscriptionPlan} fallbackNavigationPath="/dashboard">
            {({ plan, flowerTypeMap, refreshPlan }: { plan: Plan; flowerTypeMap: Map<number, FlowerType>; refreshPlan: () => Promise<void> }) => {
              if (!isSubscriptionPlan(plan)) return null;

              return (
                <SubscriptionSummary
                  plan={plan}
                  flowerTypeMap={flowerTypeMap}
                  context="ordering"
                  planId={planId || ''}
                  onRefreshPlan={refreshPlan}
                />
              );
            }}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default Step5ConfirmationPage;

