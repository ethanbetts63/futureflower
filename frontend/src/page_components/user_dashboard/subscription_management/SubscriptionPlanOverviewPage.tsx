// futureflower/frontend/src/pages/user_dashboard/subscription_management/SubscriptionPlanOverviewPage.tsx
"use client";
import { useParams } from 'next/navigation';
import Seo from '@/components/Seo';
import PlanDisplay from '@/components/PlanDisplay';
import SubscriptionSummary from '@/components/SubscriptionSummary';
import { getOrder } from '@/api/orders';
import type { Order } from '../../../types/Order';
import type { FlowerType } from '../../../types/FlowerType';

const SubscriptionPlanOverviewPage = () => {
  const params = useParams();
  const planId = params.planId as string | undefined;

  return (
    <>
      <Seo title="Subscription Overview | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getOrder} fallbackNavigationPath="/dashboard">
            {({ plan, flowerTypeMap }: { plan: Order; flowerTypeMap: Map<number, FlowerType> }) => {
              return (
                <SubscriptionSummary
                  plan={plan}
                  flowerTypeMap={flowerTypeMap}
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
