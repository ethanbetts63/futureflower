// frontend/src/pages/single_delivery_flow/Step5ConfirmationPage.tsx
import { useParams } from 'react-router-dom';
import Seo from '@/components/Seo';
import PlanDisplay from '@/components/PlanDisplay';
import UpfrontSummary from '@/components/UpfrontSummary';
import { getUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';
import type { Plan, FlowerType, UpfrontPlan } from '@/types';

const Step5ConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();

  return (
    <>
      <Seo title="Confirm Your Order | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getUpfrontPlanAsSingleDelivery} fallbackNavigationPath="/dashboard">
            {({ plan, flowerTypeMap, refreshPlan }: { plan: Plan; flowerTypeMap: Map<number, FlowerType>; refreshPlan: () => Promise<void> }) => {
              return (
                <UpfrontSummary
                  plan={plan as UpfrontPlan}
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