// futureflower/frontend/src/pages/user_dashboard/subscription_management/SubscriptionPlanOverviewPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Sprout, RefreshCw } from 'lucide-react';
import Seo from '@/components/Seo';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import PaymentHistoryCard from '@/components/PaymentHistoryCard';
import PlanActivationBanner from '@/components/PlanActivationBanner';
import PlanDisplay from '@/components/PlanDisplay';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import { Badge } from '@/components/ui/badge';
import { getSubscriptionPlan } from '@/api';
import type { SubscriptionPlan } from '@/types/SubscriptionPlan';
import type { Plan } from '../../../types/Plan';
import type { FlowerType } from '../../../types/FlowerType';

const SubscriptionPlanOverviewPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();

  const isSubscriptionPlan = (plan: any): plan is SubscriptionPlan => {
    return 'stripe_subscription_id' in plan;
  };

  return (
    <>
      <Seo title="Subscription Overview | FutureFlower" />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getSubscriptionPlan} fallbackNavigationPath="/dashboard/plans">
            {({ plan, flowerTypeMap }: { plan: Plan; flowerTypeMap: Map<number, FlowerType> }) => {
              if (!isSubscriptionPlan(plan)) return null;

              const fullAddress = [
                plan.recipient_street_address,
                plan.recipient_suburb,
                plan.recipient_city,
                plan.recipient_state,
                plan.recipient_postcode,
                plan.recipient_country
              ].filter(Boolean).join(', ');

              const preferredTypes = plan.preferred_flower_types
                .map(id => flowerTypeMap.get(Number(id)))
                .filter((ft): ft is FlowerType => !!ft);

              return (
                <div className="space-y-8">
                  {plan.status !== 'active' && planId && <PlanActivationBanner planId={planId} />}
                  
                  <UnifiedSummaryCard 
                    title="Subscription Overview" 
                    description="Review and manage the details of your active flower subscription."
                    footer={
                      <div className="flex justify-start items-center w-full">
                        <FlowBackButton to="/dashboard/plans" />
                      </div>
                    }
                  >
                    <SummarySection label="Billing History">
                      <PaymentHistoryCard plan={plan} />
                    </SummarySection>

                    <SummarySection 
                      label="Recipient" 
                      editUrl={`/dashboard/subscription-plans/${planId}/edit-recipient`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-black/20 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-lg font-['Playfair_Display',_serif]">
                            {plan.recipient_first_name} {plan.recipient_last_name}
                          </p>
                          <p className="text-black/60">{fullAddress || 'No address provided'}</p>
                        </div>
                      </div>
                    </SummarySection>

                    <SummarySection 
                      label="Subscription Schedule" 
                      editUrl={`/dashboard/subscription-plans/${planId}/edit-structure`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <RefreshCw className="h-5 w-5 text-black/20 flex-shrink-0" />
                          <span className="font-bold font-['Playfair_Display',_serif] text-lg capitalize">
                            {plan.frequency}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-black/20 flex-shrink-0" />
                          <span className="text-black/60">
                            Next delivery on {plan.start_date ? new Date(plan.start_date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </SummarySection>

                    <SummarySection 
                      label="Flower Preferences" 
                      editUrl={`/dashboard/subscription-plans/${planId}/edit-preferences`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <Sprout className="h-5 w-5 text-black/20 mt-0.5 flex-shrink-0" />
                          <div className="flex flex-wrap gap-2">
                            {preferredTypes.length > 0 ? (
                              preferredTypes.map(type => (
                                <Badge key={type.id} variant="secondary" className="bg-black/5 hover:bg-black/10 text-black border-none px-3 py-1">
                                  {type.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-black/40 italic">Florist's choice of seasonal blooms</span>
                            )}
                          </div>
                        </div>
                        {plan.flower_notes && (
                          <div className="bg-black/5 p-4 rounded-xl text-sm text-black/70 italic ">
                            <span className="font-semibold">Notes for florist:</span> {plan.flower_notes}
                          </div>
                        )}
                      </div>
                    </SummarySection>

                    <ImpactSummary 
                      price={Number(plan.total_amount)} 
                      editUrl={`/dashboard/subscription-plans/${planId}/edit-structure`}
                    />
                  </UnifiedSummaryCard>
                </div>
              );
            }}
          </PlanDisplay>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPlanOverviewPage;
