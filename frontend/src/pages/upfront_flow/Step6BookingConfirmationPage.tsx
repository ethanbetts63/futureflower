// futureflower/frontend/src/pages/flow/Step6BookingConfirmationPage.tsx
import { useParams } from 'react-router-dom';
import Seo from '@/components/Seo';
import PlanDisplay from '@/components/PlanDisplay';
import UpfrontSummary from '@/components/UpfrontSummary';
import { getUpfrontPlan } from '@/api';
import type { UpfrontPlan } from '../../types/UpfrontPlan';
import type { FlowerType } from '../../types/FlowerType';

const Step6BookingConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();

  return (
    <>
      <Seo title="Confirm Your Plan | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getUpfrontPlan} fallbackNavigationPath="/dashboard">
            {({ plan, flowerTypeMap, refreshPlan }: { plan: UpfrontPlan; flowerTypeMap: Map<number, FlowerType>; refreshPlan: () => Promise<void> }) => {
              return (
                <UpfrontSummary
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

export default Step6BookingConfirmationPage;