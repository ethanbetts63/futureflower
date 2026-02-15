// futureflower/frontend/src/pages/subscription_flow/Step5ConfirmationPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Sprout, RefreshCw, Tag } from 'lucide-react';
import Seo from '@/components/Seo';
import BackButton from '@/components/BackButton';
import PlanDisplay from '@/components/PlanDisplay';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import { Badge } from '@/components/ui/badge';
import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';
import DiscountCodeInput from '@/components/form_flow/DiscountCodeInput';
import { getSubscriptionPlan } from '@/api';
import type { SubscriptionPlan } from '@/types/SubscriptionPlan';
import type { Plan } from '../../types/Plan';
import type { FlowerType } from '../../types/FlowerType';

const Step5ConfirmationPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  const isSubscriptionPlan = (plan: any): plan is SubscriptionPlan => {
    return 'stripe_subscription_id' in plan;
  };

  return (
    <>
      <Seo title="Confirm Your Subscription | FutureFlower" />
      <div className="min-h-screen w-full py-12 md:py-20" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <PlanDisplay getPlan={getSubscriptionPlan} fallbackNavigationPath="/dashboard">
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
                <div className="space-y-10">
                  <UnifiedSummaryCard 
                    title="Review Your Subscription" 
                    description="Please review your subscription details below. This is the final step before payment."
                  >
                    <SummarySection 
                      label="Recipient" 
                      editUrl={`/subscribe-flow/subscription-plan/${planId}/recipient`}
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
                      editUrl={`/subscribe-flow/subscription-plan/${planId}/structure`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <RefreshCw className="h-5 w-5 text-black/20 flex-shrink-0" />
                          <span className="font-bold font-['Playfair_Display',_serif] text-lg capitalize">
                            Every {plan.frequency}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-black/20 flex-shrink-0" />
                          <span className="text-black/60">
                            Starting on {plan.start_date ? new Date(plan.start_date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </SummarySection>

                    <SummarySection 
                      label="Flower Preferences" 
                      editUrl={`/subscribe-flow/subscription-plan/${planId}/preferences`}
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
                          <div className="bg-black/5 p-4 rounded-xl text-sm text-black/70 italic">
                            Notes for florist: {plan.flower_notes}
                          </div>
                        )}
                      </div>
                    </SummarySection>

                    <ImpactSummary 
                      price={Number(plan.total_amount)} 
                      editUrl={`/subscribe-flow/subscription-plan/${planId}/structure`}
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

                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
                    <BackButton to={`/subscribe-flow/subscription-plan/${planId}/structure`} />
                    <PaymentInitiatorButton
                      itemType="SUBSCRIPTION_PLAN_NEW"
                      details={{
                        subscription_plan_id: planId,
                      }}
                      discountCode={discountCode}
                      backPath={`/subscribe-flow/subscription-plan/${planId}/confirmation`}
                      disabled={isSubmitting || !planId}
                      onPaymentInitiate={() => setIsSubmitting(true)}
                      onPaymentError={() => setIsSubmitting(false)}
                      size="lg"
                      className="w-full md:w-auto px-10 py-8 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Proceed to Payment <ArrowRight className="ml-2 h-6 w-6" />
                    </PaymentInitiatorButton>
                  </div>
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