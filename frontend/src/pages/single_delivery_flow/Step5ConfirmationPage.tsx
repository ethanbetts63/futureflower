// frontend/src/pages/single_delivery_flow/Step5ConfirmationPage.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, MessageSquare, StickyNote, Sprout } from 'lucide-react';
import Seo from '@/components/Seo';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import PlanDisplay from '@/components/PlanDisplay';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import { formatDate } from '@/utils/utils';

import { getUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';
import type { Plan, FlowerType, UpfrontPlan } from '@/types';
import { OCCASION_IMAGES, DEFAULT_FLOWER_IMAGE } from '@/utils/flowerTypeImages';

import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';

const Step5ConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <Seo title="Confirm Your Order | FutureFlower" />
      <StepProgressBar planName="Single Delivery" currentStep={4} totalSteps={4} isReview={true} />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getUpfrontPlanAsSingleDelivery} fallbackNavigationPath="/dashboard">
            {({ plan, flowerTypeMap }: { plan: Plan; flowerTypeMap: Map<number, FlowerType> }) => {
              const upfrontPlan = plan as UpfrontPlan;
              const fullAddress = [
                upfrontPlan.recipient_street_address,
                upfrontPlan.recipient_suburb,
                upfrontPlan.recipient_city,
                upfrontPlan.recipient_state,
                upfrontPlan.recipient_postcode,
                upfrontPlan.recipient_country
              ].filter(Boolean).join(', ');

              const draftMessage = upfrontPlan.draft_card_messages?.['0'] || '';
              const eventMessage = upfrontPlan.events?.[0]?.message || '';
              const message = draftMessage || eventMessage;

              const preferredTypes = upfrontPlan.preferred_flower_types
                .map(id => flowerTypeMap.get(Number(id)))
                .filter((ft): ft is FlowerType => !!ft);

              return (
                <div>
                  <UnifiedSummaryCard 
                    title="Confirm Your Delivery" 
                    description="Please review the details of your order before proceeding to payment."
                    footer={
                      <div className="flex flex-row justify-between items-center w-full gap-4">
                        <FlowBackButton to={`/single-delivery-flow/plan/${planId}/structure`} />
                        <PaymentInitiatorButton
                          itemType="UPFRONT_PLAN_NEW"
                          details={{ upfront_plan_id: planId }}
                          backPath={`/single-delivery-flow/plan/${planId}/confirmation`}
                          disabled={isSubmitting || !planId}
                          onPaymentInitiate={() => setIsSubmitting(true)}
                          onPaymentError={() => setIsSubmitting(false)}
                        >
                          Next: Payment
                        </PaymentInitiatorButton>
                      </div>
                    }
                  >
                    <SummarySection 
                      label="Recipient" 
                      editUrl={`/single-delivery-flow/plan/${planId}/recipient`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-black/20 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-lg font-['Playfair_Display',_serif]">
                            {upfrontPlan.recipient_first_name} {upfrontPlan.recipient_last_name}
                          </p>
                          <p className="text-black/60">{fullAddress || 'No address provided'}</p>
                        </div>
                      </div>
                    </SummarySection>

                    <SummarySection 
                      label="Delivery Date" 
                      editUrl={`/single-delivery-flow/plan/${planId}/structure`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-black/20 flex-shrink-0" />
                        <span className="font-bold font-['Playfair_Display',_serif] text-lg">
                          {formatDate(upfrontPlan.start_date)}
                        </span>
                      </div>
                      {upfrontPlan.delivery_notes && (
                        <div className="mt-3 flex items-start gap-3 bg-black/5 p-4 rounded-xl">
                          <StickyNote className="h-4 w-4 text-black/40 mt-0.5" />
                          <p className="text-sm text-black/70 italic leading-relaxed">
                            "{upfrontPlan.delivery_notes}"
                          </p>
                        </div>
                      )}
                    </SummarySection>

                    {message && (
                      <SummarySection 
                        label="Card Message" 
                        editUrl={`/single-delivery-flow/plan/${planId}/structure`}
                      >
                        <div className="flex items-start bg-[var(--colorgreen)]/10 rounded-2xl border border-[var(--colorgreen)]/20 p-6">
                          <MessageSquare className="h-5 w-5 text-[var(--colorgreen)] mt-1 flex-shrink-0 mr-4" />
                          <p className="text-lg font-medium italic text-black/80 leading-relaxed">
                            "{message}"
                          </p>
                        </div>
                      </SummarySection>
                    )}

                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 py-6 border-b border-black/5 last:border-0">
                      <div className="flex-1">
                        {preferredTypes.length > 0 ? (
                          <div className="flex items-start gap-5">
                            <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-black/5 flex-shrink-0">
                              <img
                                src={OCCASION_IMAGES[preferredTypes[0].name] || DEFAULT_FLOWER_IMAGE}
                                alt={preferredTypes[0].name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="text-xs font-bold tracking-[0.2em] text-black uppercase block mb-1">
                                Flower Preferences
                              </span>
                              <h4 className="text-xl font-bold text-black font-['Playfair_Display',_serif]">
                                {preferredTypes[0].name}
                              </h4>
                              {preferredTypes[0].tagline && (
                                <p className="text-sm text-black/60 leading-relaxed mt-1">
                                  {preferredTypes[0].tagline}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs font-bold tracking-[0.2em] text-black uppercase block mb-2">
                              Flower Preferences
                            </span>
                            <div className="flex items-center gap-3">
                              <Sprout className="h-5 w-5 text-black/20 flex-shrink-0" />
                              <span className="text-black/40 italic">Florist's choice of seasonal blooms</span>
                            </div>
                          </div>
                        )}
                        {upfrontPlan.flower_notes && (
                          <div className="bg-black/5 p-4 rounded-xl text-sm text-black/70 italic mt-4">
                            <span className="font-semibold">Notes for florist:</span> {upfrontPlan.flower_notes}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 pt-1 w-full sm:w-auto text-right">
                        <Link
                          to={`/single-delivery-flow/plan/${planId}/preferences`}
                          className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-4 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>

                    <ImpactSummary 
                      price={Number(upfrontPlan.budget)} 
                      editUrl={`/single-delivery-flow/plan/${planId}/structure`}
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

export default Step5ConfirmationPage;
