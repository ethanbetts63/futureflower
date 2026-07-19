// frontend/src/app/order/details/DetailsPage.tsx
"use client";
import PlanDisplay from '@/shared_components/PlanDisplay';
import OrderDetails from '@/app/order/details/OrderDetails';
import StepProgressBar from '@/shared_components/form_flow/StepProgressBar';
import { getGuestOrder } from '@/api/guestCheckout';
import type { Order } from '@/types';

// The progress bar sits above the background wrapper — full-width and flush with
// the nav — matching step 2 (the recipient page). Keeping it out of the padded,
// max-w-4xl container is what makes it screen-width rather than inset.
const DetailsPage = () => {
  return (
    <>
      <StepProgressBar planName="Single Delivery Plan" currentStep={3} totalSteps={3} />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getGuestOrder} fallbackNavigationPath="/">
            {({ plan, refreshPlan }: { plan: Order; refreshPlan: () => Promise<void> }) => (
              <OrderDetails plan={plan} onRefreshPlan={refreshPlan} />
            )}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default DetailsPage;
