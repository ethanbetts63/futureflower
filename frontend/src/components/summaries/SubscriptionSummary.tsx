import React, { useState } from 'react';
import { Calendar, RefreshCw, Tag, MessageSquare } from 'lucide-react';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import PlanActivationBanner from '@/components/PlanActivationBanner';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import RecipientSummary from '@/components/form_flow/RecipientSummary';
import FlowerPreferencesSummary from '@/components/form_flow/FlowerPreferencesSummary';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';
import PaymentHistoryCard from '@/components/PaymentHistoryCard';
import DiscountCodeInput from '@/components/form_flow/DiscountCodeInput';
import { formatDate } from '@/utils/utils';
import type { SubscriptionPlan } from '@/types/SubscriptionPlan';
import type { FlowerType } from '@/types/FlowerType';

interface SubscriptionSummaryProps {
  plan: SubscriptionPlan;
  flowerTypeMap: Map<number, FlowerType>;
  context: 'ordering' | 'management';
  planId: string;
}

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({ 
  plan, 
  flowerTypeMap, 
  context, 
  planId 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  const isOrdering = context === 'ordering';
  
  // Base paths for editing
  const editBasePath = isOrdering 
    ? `/subscribe-flow/subscription-plan/${planId}` 
    : `/dashboard/subscription-plans/${planId}`;

  const preferredTypes = plan.preferred_flower_types
    .map(id => flowerTypeMap.get(Number(id)))
    .filter((ft): ft is FlowerType => !!ft);

  return (
    <div className="space-y-8">
      {isOrdering ? (
        <StepProgressBar planName="Flower Subscription" currentStep={4} totalSteps={4} isReview={true} />
      ) : (
        plan.status !== 'active' && <PlanActivationBanner planId={planId} />
      )}

      <UnifiedSummaryCard 
        title={isOrdering ? "Review Your Subscription" : "Subscription Overview"} 
        description={isOrdering 
          ? "Please review your subscription details below. This is the final step before payment." 
          : "Review and manage the details of your active flower subscription."
        }
        footer={
          isOrdering ? (
            <div className="flex flex-row justify-between items-center w-full gap-4">
              <FlowBackButton to={`${editBasePath}/structure`} />
              <PaymentInitiatorButton
                itemType="SUBSCRIPTION_PLAN_NEW"
                details={{ subscription_plan_id: planId }}
                discountCode={discountCode}
                backPath={`${editBasePath}/confirmation`}
                disabled={isSubmitting || !planId}
                onPaymentInitiate={() => setIsSubmitting(true)}
                onPaymentError={() => setIsSubmitting(false)}
              >
                Next: Payment
              </PaymentInitiatorButton>
            </div>
          ) : (
            <div className="flex justify-start items-center w-full">
              <FlowBackButton to="/dashboard/plans" />
            </div>
          )
        }
      >
        {!isOrdering && (
          <SummarySection label="Billing History">
            <PaymentHistoryCard plan={plan} />
          </SummarySection>
        )}

        <RecipientSummary
          plan={plan}
          editUrl={`${editBasePath}/edit-recipient`}
        />

        <SummarySection 
          label="Subscription Schedule" 
          editUrl={`${editBasePath}/edit-structure`}
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
                {isOrdering ? 'Starting on ' : 'Next delivery on '}
                {plan.start_date ? formatDate(plan.start_date) : 'Not set'}
              </span>
            </div>
          </div>
        </SummarySection>

        {plan.subscription_message && (
          <SummarySection 
            label="Card Message" 
            editUrl={`${editBasePath}/edit-structure`}
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
          editUrl={`${editBasePath}/edit-preferences`}
        />

        <ImpactSummary 
          price={Number(plan.budget)} 
          editUrl={`${editBasePath}/edit-structure`}
        />

        {isOrdering && (
          <SummarySection label="Promotions">
            <div className="flex items-start gap-3 mt-1">
              <Tag className="h-5 w-5 text-black/20 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <DiscountCodeInput onCodeValidated={(code) => setDiscountCode(code)} />
              </div>
            </div>
          </SummarySection>
        )}
      </UnifiedSummaryCard>
    </div>
  );
};

export default SubscriptionSummary;
