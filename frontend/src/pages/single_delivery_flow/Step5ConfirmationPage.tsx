// frontend/src/pages/single_delivery_flow/Step5ConfirmationPage.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, MessageSquare, StickyNote, Sprout } from 'lucide-react';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import PlanDisplay from '@/components/PlanDisplay';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/utils';

import { getUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';
import type { Plan, FlowerType, UpfrontPlan } from '@/types';

import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';

const Step5ConfirmationPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <Seo title="Confirm Your Order | FutureFlower" />
      <div className="min-h-screen w-full py-12 md:py-20" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
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
                <div className="">
                  <UnifiedSummaryCard 
                    title="Confirm Your Delivery" 
                    description="Please review the details of your order before proceeding to payment."
                    footer={
                      <div className="flex flex-col md:flex-row justify-between items-center w-full">
                        <BackButton to={`/single-delivery-flow/plan/${planId}/structure`} />
                        <PaymentInitiatorButton
                          itemType="UPFRONT_PLAN_NEW"
                          details={{ upfront_plan_id: planId }}
                          backPath={`/single-delivery-flow/plan/${planId}/confirmation`}
                          disabled={isSubmitting || !planId}
                          onPaymentInitiate={() => setIsSubmitting(true)}
                          onPaymentError={() => setIsSubmitting(false)}
                          size="lg"
                          className="w-full md:w-auto px-10 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                        >
                          Proceed to Payment <ArrowRight className="ml-2 h-3 w-3" />
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
                        <div className="flex items-start gap-3 bg-[var(--colorgreen)]/10 p-5 rounded-2xl border border-[var(--colorgreen)]/20">
                          <MessageSquare className="h-5 w-5 text-[var(--colorgreen)] mt-1 flex-shrink-0" />
                          <p className="text-lg font-medium italic text-black/80 leading-relaxed">
                            "{message}"
                          </p>
                        </div>
                      </SummarySection>
                    )}

                    <SummarySection 
                      label="Flower Preferences" 
                      editUrl={`/single-delivery-flow/plan/${planId}/preferences`}
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
                        {upfrontPlan.flower_notes && (
                          <div className="bg-black/5 p-4 rounded-xl text-sm text-black/70 italic">
                            Notes for florist: {upfrontPlan.flower_notes}
                          </div>
                        )}
                      </div>
                    </SummarySection>

                    <ImpactSummary 
                      price={Number(upfrontPlan.total_amount)} 
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
