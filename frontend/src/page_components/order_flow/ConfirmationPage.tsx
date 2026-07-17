// frontend/src/page_components/order_flow/ConfirmationPage.tsx
"use client";
import PlanDisplay from '@/components/PlanDisplay';
import OrderConfirmation from '@/components/OrderConfirmation';
import { getGuestOrder } from '@/api/guestCheckout';
import type { Order } from '@/types';

const ConfirmationPage = () => {
  return (
    <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
      <div className="container mx-auto px-0 md:px-4 max-w-4xl">
        <PlanDisplay getPlan={getGuestOrder} fallbackNavigationPath="/">
          {({ plan, refreshPlan }: { plan: Order; refreshPlan: () => Promise<void> }) => (
            <OrderConfirmation plan={plan} onRefreshPlan={refreshPlan} />
          )}
        </PlanDisplay>
      </div>
    </div>
  );
};

export default ConfirmationPage;
