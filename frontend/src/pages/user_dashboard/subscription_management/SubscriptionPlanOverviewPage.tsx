// futureflower/frontend/src/pages/user_dashboard/subscription_management/SubscriptionPlanOverviewPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Seo from '@/components/Seo';
import PlanDisplay from '@/components/PlanDisplay';
import SubscriptionSummary from '@/components/SubscriptionSummary';
import { getSubscriptionPlan } from '@/api';
import type { SubscriptionPlan } from '@/types/SubscriptionPlan';
import type { Plan } from '../../../types/Plan';
import type { FlowerType } from '../../../types/FlowerType';

const SubscriptionPlanOverviewPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();

  const isSubscriptionPlan = (plan: any): plan is SubscriptionPlan => {
    return 'stripe_subscription_id' in plan;
  };

  return (
    <>
      <Seo title="Subscription Overview | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getSubscriptionPlan} fallbackNavigationPath="/dashboard/plans">
            {({ plan, flowerTypeMap }: { plan: Plan; flowerTypeMap: Map<number, FlowerType> }) => {
              if (!isSubscriptionPlan(plan)) return null;

              return (
                <SubscriptionSummary
                  plan={plan}
                  flowerTypeMap={flowerTypeMap}
                  context="management"
                  planId={planId || ''}
                />
              );
            }}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPlanOverviewPage;
