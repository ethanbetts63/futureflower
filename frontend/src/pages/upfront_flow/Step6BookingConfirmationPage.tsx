// futureflower/frontend/src/pages/flow/Step6BookingConfirmationPage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Sprout, MessageSquare, Tag, Clock } from 'lucide-react';
import Seo from '@/components/Seo';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import PlanDisplay from '@/components/PlanDisplay';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';
import DiscountCodeInput from '@/components/form_flow/DiscountCodeInput';
import { formatDate } from '@/utils/utils';

import { getUpfrontPlan } from '@/api';
import type { UpfrontPlan } from '../../types/UpfrontPlan';
import type { FlowerType } from '../../types/FlowerType';
import { OCCASION_IMAGES, DEFAULT_FLOWER_IMAGE } from '@/utils/flowerTypeImages';

const Step6BookingConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  return (
    <>
      <Seo title="Confirm Your Plan | FutureFlower" />
      <StepProgressBar planName="Upfront Plan" currentStep={5} totalSteps={5} isReview={true} />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getUpfrontPlan} fallbackNavigationPath="/dashboard">
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
                <div className="space-y-10">
                  <UnifiedSummaryCard 
                    title="Review Your Flower Plan" 
                    description="This is the final step before activating your flower plan. Please ensure everything is correct."
                    footer={
                      <div className="flex flex-row justify-between items-center w-full gap-4">
                        <FlowBackButton to={`/upfront-flow/upfront-plan/${planId}/structure`} />
                        <PaymentInitiatorButton
                          itemType="UPFRONT_PLAN_NEW"
                          details={{ upfront_plan_id: planId }}
                          discountCode={discountCode}
                          backPath={`/upfront-flow/upfront-plan/${planId}/confirmation`}
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
                      editUrl={`/upfront-flow/upfront-plan/${planId}/recipient`}
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
                      editUrl={`/upfront-flow/upfront-plan/${planId}/structure`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-black/20 flex-shrink-0" />
                          <span className="font-bold font-['Playfair_Display',_serif] text-lg capitalize">
                            {plan.frequency} Plan — {plan.years} {plan.years === 1 ? 'Year' : 'Years'}
                          </span>
                        </div>
                        
                        <div className="bg-black/5 rounded-2xl p-6">
                          <h5 className="text-xs font-bold tracking-widest uppercase text-black mb-4">Planned Deliveries</h5>
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
                        {plan.flower_notes && (
                          <div className="bg-black/5 p-4 rounded-xl text-sm text-black/70 italic mt-4">
                            <span className="font-semibold">Notes for florist:</span> {plan.flower_notes}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 pt-1 w-full sm:w-auto text-right">
                        <Link
                          to={`/upfront-flow/upfront-plan/${planId}/preferences`}
                          className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-4 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>

                    <ImpactSummary 
                      price={Number(plan.budget)} 
                      editUrl={`/upfront-flow/upfront-plan/${planId}/structure`}
                    />

                    <SummarySection label="Promotions">
                      <div className="flex items-start gap-3 mt-1">
                        <Tag className="h-5 w-5 text-black/20 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <DiscountCodeInput onCodeValidated={(code) => setDiscountCode(code)} />
                        </div>
                      </div>
                    </SummarySection>
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

export default Step6BookingConfirmationPage;
