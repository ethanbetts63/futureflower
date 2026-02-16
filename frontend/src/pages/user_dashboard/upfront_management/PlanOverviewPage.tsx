// futureflower/frontend/src/pages/user_dashboard/PlanOverviewPage.tsx
import { useParams } from 'react-router-dom';
import Seo from '@/components/Seo';
import PlanDisplay from '@/components/PlanDisplay';
import UpfrontSummary from '@/components/summaries/UpfrontSummary';
import { getUpfrontPlan } from '@/api/upfrontPlans';
import type { UpfrontPlan } from '../../../types/UpfrontPlan';
import type { FlowerType } from '../../../types/FlowerType';

const PlanOverviewPage = () => {
  const { planId } = useParams<{ planId: string }>();

  return (
    <>
      <Seo title="Plan Overview | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getUpfrontPlan} fallbackNavigationPath="/dashboard/plans">
            {({ plan, flowerTypeMap }: { plan: UpfrontPlan; flowerTypeMap: Map<number, FlowerType> }) => {
              return (
                <UpfrontSummary
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

export default PlanOverviewPage;
