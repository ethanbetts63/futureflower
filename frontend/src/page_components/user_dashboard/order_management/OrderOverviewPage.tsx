// futureflower/frontend/src/page_components/user_dashboard/order_management/OrderOverviewPage.tsx
"use client";
import { useParams } from 'next/navigation';
import PlanDisplay from '@/components/PlanDisplay';
import OrderSummary from '@/components/OrderSummary';
import { getOrder } from '@/api/orders';
import type { Order } from '@/types/Order';
import type { FlowerType } from '@/types/FlowerType';

const OrderOverviewPage = () => {
  const params = useParams();
  const planId = params.planId as string | undefined;

  return (
    <>
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getOrder} fallbackNavigationPath="/dashboard">
            {({ plan, flowerTypeMap, refreshPlan }: { plan: Order; flowerTypeMap: Map<number, FlowerType>; refreshPlan: () => Promise<void> }) => {
              return (
                <OrderSummary
                  plan={plan}
                  flowerTypeMap={flowerTypeMap}
                  context="management"
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

export default OrderOverviewPage;
