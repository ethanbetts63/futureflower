"use client";
import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import PlanDisplay from '@/shared_components/PlanDisplay';
import PlanOverview from '@/shared_components/PlanOverview';
import { getOrder } from '@/api/orders';
import type { Order } from '@/types/Order';

const OrderOverviewPage = () => {
  const params = useParams();
  const planId = params.planId as string;

  const getPlan = useCallback(() => getOrder(planId), [planId]);

  return (
    <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
      <div className="container mx-auto px-0 md:px-4 max-w-4xl">
        <PlanDisplay getPlan={getPlan} fallbackNavigationPath="/dashboard">
          {({ plan }: { plan: Order }) => <PlanOverview plan={plan} />}
        </PlanDisplay>
      </div>
    </div>
  );
};

export default OrderOverviewPage;
