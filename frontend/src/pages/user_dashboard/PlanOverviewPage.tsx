// foreverflower/frontend/src/pages/user_dashboard/PlanOverviewPage.tsx
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import PlanStructureCard from '@/components/PlanStructureCard';
import DeliveryDatesCard from '@/components/DeliveryDatesCard';
import PreferencesCard from '@/components/PreferencesCard';
import MessagesCard from '@/components/MessagesCard';
import RecipientCard from '@/components/RecipientCard';
import PaymentHistoryCard from '@/components/PaymentHistoryCard';
import PlanActivationBanner from '@/components/PlanActivationBanner';
import PlanDisplay from '@/components/PlanDisplay';

const PlanOverviewPage = () => {
  const { planId } = useParams<{ planId: string }>();

  return (
    <>
      <Seo title="Plan Overview | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto max-w-4xl">
          <PlanDisplay fallbackNavigationPath="/dashboard/flower-plans">
            {({ plan, colorMap, flowerTypeMap }) => (
              <>
                {plan.status !== 'active' && planId && <PlanActivationBanner planId={planId} />}
                <div className="space-y-8 mt-4">
                  <Card className="w-full bg-white shadow-md border-none text-black">
                    <CardHeader>
                      <CardTitle className="text-3xl">Plan Overview</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Review and manage the details of your flower plan.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="space-y-6">
                    <PaymentHistoryCard plan={plan} />

                    <RecipientCard
                      plan={plan}
                      editUrl={`/dashboard/plans/${planId}/edit-recipient`}
                    />

                    <PlanStructureCard
                      plan={plan}
                      editUrl={`/dashboard/plans/${planId}/edit-structure`}
                    />

                    <DeliveryDatesCard
                      plan={plan}
                      editUrl={`/dashboard/plans/${planId}/edit-structure`}
                    />

                    <PreferencesCard
                      plan={plan}
                      colorMap={colorMap}
                      flowerTypeMap={flowerTypeMap}
                      editUrl={`/dashboard/plans/${planId}/edit-preferences`}
                    />

                    <MessagesCard
                      plan={plan}
                      editUrl={`/dashboard/plans/${planId}/edit-messages`}
                    />
                    
                    <div className="flex justify-between items-center mt-8">
                      <BackButton to="/dashboard/flower-plans" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default PlanOverviewPage;