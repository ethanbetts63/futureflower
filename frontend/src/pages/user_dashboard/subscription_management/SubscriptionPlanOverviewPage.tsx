// futureflower/frontend/src/pages/user_dashboard/subscription_management/SubscriptionPlanOverviewPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import PreferencesCard from '@/components/PreferencesCard';
import RecipientCard from '@/components/RecipientCard';
import PaymentHistoryCard from '@/components/PaymentHistoryCard';
import PlanActivationBanner from '@/components/PlanActivationBanner';
import PlanDisplay from '@/components/PlanDisplay';
import SubscriptionStructureCard from '@/components/SubscriptionStructureCard';
import { getSubscriptionPlan } from '@/api';
import type { SubscriptionPlan } from '@/types/SubscriptionPlan';
import type { Plan } from '../../../types/Plan';
import type { FlowerType } from '../../../types/FlowerType';

const SubscriptionPlanOverviewPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();

  const isSubscriptionPlan = (plan: any): plan is SubscriptionPlan => {
    return 'frequency' in plan && 'price_per_delivery' in plan;
  };

  return (
    <>
      <Seo title="Subscription Overview | FutureFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto max-w-4xl">
          <PlanDisplay getPlan={getSubscriptionPlan} fallbackNavigationPath="/dashboard/plans">
            {({ plan, flowerTypeMap }: { plan: Plan; flowerTypeMap: Map<number, FlowerType> }) => (
                isSubscriptionPlan(plan) && (
                    <>
                        {plan.status !== 'active' && planId && <PlanActivationBanner planId={planId} />}
                        <div className="space-y-8 mt-4">
                        <Card className="w-full bg-white shadow-md border-none text-black">
                            <CardHeader>
                            <CardTitle className="text-3xl">Subscription Overview</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Review and manage the details of your flower subscription.
                            </CardDescription>
                            </CardHeader>
                        </Card>

                        <div className="space-y-6">
                            <PaymentHistoryCard plan={plan} />

                            <RecipientCard
                                plan={plan}
                                editUrl={`/dashboard/subscription-plans/${planId}/edit-recipient`}
                            />

                            <SubscriptionStructureCard
                                plan={plan}
                                editUrl={`/dashboard/subscription-plans/${planId}/edit-structure`}
                            />

                            <PreferencesCard
                                plan={plan}
                                flowerTypeMap={flowerTypeMap}
                                editUrl={`/dashboard/subscription-plans/${planId}/edit-preferences`}
                            />
                            
                            <div className="flex justify-between items-center mt-8">
                                <BackButton to="/dashboard/plans" />
                            </div>
                        </div>
                        </div>
                    </>
                )
            )}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPlanOverviewPage;
