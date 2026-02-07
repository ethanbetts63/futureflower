// foreverflower/frontend/src/pages/user_dashboard/single_delivery_management/SingleDeliveryPlanOverviewPage.tsx
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
import SingleDeliveryStructureCard from '@/components/SingleDeliveryStructureCard';
import { getSingleDeliveryPlan, updateSingleDeliveryPlan } from '@/api';
import type { SingleDeliveryPlan } from '@/types/SingleDeliveryPlan';
import type { Plan } from '../../../types/Plan';
import type { Color } from '../../../types/Color';
import type { FlowerType } from '../../../types/FlowerType';

const SingleDeliveryPlanOverviewPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();

  const isSingleDeliveryPlan = (plan: any): plan is SingleDeliveryPlan => {
    return 'budget' in plan && 'total_amount' in plan;
  };

  return (
    <>
      <Seo title="Single Delivery Overview | ForeverFlower" />
      <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto max-w-4xl">
          <PlanDisplay getPlan={getSingleDeliveryPlan} fallbackNavigationPath="/dashboard/plans">
            {({ plan, colorMap, flowerTypeMap }: { plan: Plan; colorMap: Map<number, Color>; flowerTypeMap: Map<number, FlowerType> }) => (
                isSingleDeliveryPlan(plan) && (
                    <>
                        {plan.status !== 'active' && planId && <PlanActivationBanner planId={planId} />}
                        <div className="space-y-8 mt-4">
                        <Card className="w-full bg-white shadow-md border-none text-black">
                            <CardHeader>
                            <CardTitle className="text-3xl">Single Delivery Overview</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Review and manage the details of your single delivery.
                            </CardDescription>
                            </CardHeader>
                        </Card>

                        <div className="space-y-6">
                            <PaymentHistoryCard plan={plan} />

                            <RecipientCard
                                plan={plan}
                                editUrl={`/dashboard/single-delivery-plans/${planId}/edit-recipient`}
                            />

                            <SingleDeliveryStructureCard
                                plan={plan}
                                editUrl={`/dashboard/single-delivery-plans/${planId}/edit-structure`}
                            />

                            <PreferencesCard
                                plan={plan}
                                colorMap={colorMap}
                                flowerTypeMap={flowerTypeMap}
                                editUrl={`/dashboard/single-delivery-plans/${planId}/edit-preferences`}
                                getPlan={getSingleDeliveryPlan}
                                updatePlan={updateSingleDeliveryPlan}
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

export default SingleDeliveryPlanOverviewPage;
