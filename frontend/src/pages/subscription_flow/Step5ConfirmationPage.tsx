// futureflower/frontend/src/pages/subscription_flow/Step5ConfirmationPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, RefreshCw, Tag, MessageSquare } from 'lucide-react';
import Seo from '@/components/Seo';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import PlanDisplay from '@/components/PlanDisplay';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import RecipientSummary from '@/components/form_flow/RecipientSummary';
import FlowerPreferencesSummary from '@/components/form_flow/FlowerPreferencesSummary';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
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
    return 'stripe_subscription_id' in plan || 'subscription_message' in plan;
  };

  return (
    <>
      <Seo title="Confirm Your Subscription | FutureFlower" />
      <StepProgressBar planName="Flower Subscription" currentStep={4} totalSteps={4} isReview={true} />
      <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          <PlanDisplay getPlan={getSubscriptionPlan} fallbackNavigationPath="/dashboard">
            {({ plan, flowerTypeMap }: { plan: Plan; flowerTypeMap: Map<number, FlowerType> }) => {
              if (!isSubscriptionPlan(plan)) return null;

              const preferredTypes = plan.preferred_flower_types
                .map(id => flowerTypeMap.get(Number(id)))
                .filter((ft): ft is FlowerType => !!ft);

              return (
                <div>
                  <UnifiedSummaryCard 
                    title="Review Your Subscription" 
                    description="Please review your subscription details below. This is the final step before payment."
                    footer={
                      <div className="flex flex-row justify-between items-center w-full gap-4">
                        <FlowBackButton to={`/subscribe-flow/subscription-plan/${planId}/structure`} />
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
                        >
                          Next: Payment
                        </PaymentInitiatorButton>
                      </div>
                    }
                  >
                    <RecipientSummary
                      plan={plan}
                      editUrl={`/subscribe-flow/subscription-plan/${planId}/recipient`}
                    />

                    <SummarySection 
                      label="Subscription Schedule" 
                      editUrl={`/subscribe-flow/subscription-plan/${planId}/structure`}
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
                            Starting on {plan.start_date ? new Date(plan.start_date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </SummarySection>

                    {plan.subscription_message && (
                      <SummarySection 
                        label="Card Message" 
                        editUrl={`/subscribe-flow/subscription-plan/${planId}/structure`}
                      >
                        <div className="flex items-start bg-[var(--colorgreen)]/10 rounded-2xl border border-[var(--colorgreen)]/20 p-6">
                          <MessageSquare className="h-5 w-5 text-[var(--colorgreen)] mt-1 flex-shrink-0 mr-4" />
                          <p className="text-lg font-medium italic text-black/80 leading-relaxed">
                            "{plan.subscription_message}"
                          </p>
                        </div>
                      </SummarySection>
                    )}

                    <FlowerPreferencesSummary
                      preferredTypes={preferredTypes}
                      flowerNotes={plan.flower_notes}
                      editUrl={`/subscribe-flow/subscription-plan/${planId}/preferences`}
                    />

                    <ImpactSummary 
                      price={Number(plan.budget)} 
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