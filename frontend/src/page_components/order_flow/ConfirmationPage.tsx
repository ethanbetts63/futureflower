// frontend/src/page_components/order_flow/ConfirmationPage.tsx
"use client";
import PlanDisplay from '@/components/PlanDisplay';
import OrderSummary from '@/components/OrderSummary';
import { getGuestOrder } from '@/api/guestCheckout';
import type { Order, FlowerType } from '@/types';

const ConfirmationPage = () => {
  return (
    <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
      <div className="container mx-auto px-0 md:px-4 max-w-4xl">
        <PlanDisplay getPlan={getGuestOrder} fallbackNavigationPath="/">
          {({ plan, flowerTypeMap, refreshPlan }: { plan: Order; flowerTypeMap: Map<number, FlowerType>; refreshPlan: () => Promise<void> }) => {
            return (
              <OrderSummary
                plan={plan}
                flowerTypeMap={flowerTypeMap}
                context="ordering"
                onRefreshPlan={refreshPlan}
              />
            );
          }}
        </PlanDisplay>
      </div>
    </div>
  );
};

export default ConfirmationPage;
