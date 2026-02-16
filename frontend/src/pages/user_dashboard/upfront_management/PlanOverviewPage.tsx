// futureflower/frontend/src/pages/user_dashboard/PlanOverviewPage.tsx
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Sprout, Clock, MessageSquare } from 'lucide-react';
import Seo from '@/components/Seo';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import PaymentHistoryCard from '@/components/PaymentHistoryCard';
import PlanActivationBanner from '@/components/PlanActivationBanner';
import PlanDisplay from '@/components/PlanDisplay';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/utils';
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

              const messages = plan.draft_card_messages || {};
              const events = plan.events || [];

              return (
                <div className="space-y-8">
                  {plan.status !== 'active' && planId && <PlanActivationBanner planId={planId} />}
                  
                  <UnifiedSummaryCard 
                    title="Plan Overview" 
                    description="Review and manage the details of your scheduled flower plan."
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
                      editUrl={`/dashboard/upfront-plans/${planId}/edit-recipient`}
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
                      label="Plan Schedule" 
                      editUrl={`/dashboard/upfront-plans/${planId}/edit-structure`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-black/20 flex-shrink-0" />
                          <span className="font-bold font-['Playfair_Display',_serif] text-lg capitalize">
                            {plan.frequency} Plan — {plan.years} {plan.years === 1 ? 'Year' : 'Years'}
                          </span>
                        </div>
                        
                        <div className="bg-black/5 rounded-2xl p-6">
                          <h5 className="text-xs font-bold tracking-widest uppercase text-black mb-4">Upcoming Deliveries</h5>
                          <div className="space-y-4">
                            {events.map((event, idx) => (
                              <div key={idx} className="flex items-center justify-between border-b border-black/5 last:border-0 pb-3 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-4 w-4 text-black/30" />
                                  <span className="text-sm font-medium">{formatDate(event.delivery_date)}</span>
                                </div>
                                {messages[idx] && (
                                  <div className="flex items-center gap-2 text-[var(--colorgreen)]">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold uppercase tracking-tighter">Message Saved</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </SummarySection>

                    <SummarySection 
                      label="Flower Preferences" 
                      editUrl={`/dashboard/upfront-plans/${planId}/edit-preferences`}
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
                      editUrl={`/dashboard/upfront-plans/${planId}/edit-structure`}
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

export default PlanOverviewPage;