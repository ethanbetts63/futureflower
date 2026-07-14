// frontend/src/pages/single_delivery_flow/Step5ConfirmationPage.tsx
"use client";
import { useParams } from 'next/navigation';
import Seo from '@/components/Seo';
import PlanDisplay from '@/components/PlanDisplay';
import OrderSummary from '@/components/OrderSummary';
import { getGuestOrder } from '@/api/guestCheckout';
import type { Order, FlowerType } from '@/types';

const Step5ConfirmationPage = () => {
  const params = useParams();
  const planId = params.planId as string | undefined;

  return (
    <>
      <Seo title="Confirm Your Order | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getGuestOrder} fallbackNavigationPath="/">
            {({ plan, flowerTypeMap, refreshPlan }: { plan: Order; flowerTypeMap: Map<number, FlowerType>; refreshPlan: () => Promise<void> }) => {
              return (
                <OrderSummary
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
