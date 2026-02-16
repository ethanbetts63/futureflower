import React, { useState } from 'react';
import { Calendar, MessageSquare, Tag, Clock, StickyNote } from 'lucide-react';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import PlanActivationBanner from '@/components/PlanActivationBanner';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import RecipientSummary from '@/components/form_flow/RecipientSummary';
import FlowerPreferencesSummary from '@/components/form_flow/FlowerPreferencesSummary';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';
import DiscountCodeInput from '@/components/form_flow/DiscountCodeInput';
import PaymentHistoryCard from '@/components/PaymentHistoryCard';
import { formatDate } from '@/utils/utils';
import type { UpfrontPlan } from '@/types/UpfrontPlan';
import type { FlowerType } from '@/types/FlowerType';

interface UpfrontSummaryProps {
  plan: UpfrontPlan;
  flowerTypeMap: Map<number, FlowerType>;
  context: 'ordering' | 'management';
  planId: string;
}

const UpfrontSummary: React.FC<UpfrontSummaryProps> = ({ 
  plan, 
  flowerTypeMap, 
  context, 
  planId 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  const isOrdering = context === 'ordering';
  const isSingleDelivery = plan.years === 1 && plan.frequency === 'annually' && plan.status !== 'active';
  
  // Base paths for editing
  const editBasePath = isOrdering 
    ? (isSingleDelivery 
        ? `/single-delivery-flow/plan/${planId}` 
        : `/upfront-flow/upfront-plan/${planId}`)
    : `/dashboard/upfront-plans/${planId}`;

  const preferredTypes = plan.preferred_flower_types
    .map(id => flowerTypeMap.get(Number(id)))
    .filter((ft): ft is FlowerType => !!ft);

  const messages = plan.draft_card_messages || {};
  const events = plan.events || [];
  
  // For Single Delivery or context where we want to highlight the main message
  const firstDraftMessage = messages['0'] || '';
  const firstEventMessage = events[0]?.message || '';
  const mainMessage = firstDraftMessage || firstEventMessage;

  return (
    <div className="space-y-8">
      {isOrdering ? (
        <StepProgressBar 
          planName={isSingleDelivery ? "Single Delivery" : "Upfront Plan"} 
          currentStep={isSingleDelivery ? 4 : 5} 
          totalSteps={isSingleDelivery ? 4 : 5} 
          isReview={true} 
        />
      ) : (
        plan.status !== 'active' && <PlanActivationBanner planId={planId} />
      )}

      <UnifiedSummaryCard 
        title={isOrdering ? (isSingleDelivery ? "Confirm Your Delivery" : "Review Your Flower Plan") : "Plan Overview"} 
        description={isOrdering 
          ? (isSingleDelivery 
              ? "Please review the details of your order before proceeding to payment." 
              : "This is the final step before activating your flower plan. Please ensure everything is correct.")
          : "Review and manage the details of your scheduled flower plan."
        }
        footer={
          isOrdering ? (
            <div className="flex flex-row justify-between items-center w-full gap-4">
              <FlowBackButton to={`${editBasePath}/structure`} />
              <PaymentInitiatorButton
                itemType="UPFRONT_PLAN_NEW"
                details={{ upfront_plan_id: planId }}
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

        {isSingleDelivery && isOrdering ? (
          /* Specialized Single Delivery Schedule for Ordering */
          <SummarySection 
            label="Delivery Date" 
            editUrl={`${editBasePath}/structure`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-black/20 flex-shrink-0" />
              <span className="font-bold font-['Playfair_Display',_serif] text-lg">
                {formatDate(plan.start_date)}
              </span>
            </div>
            {plan.delivery_notes && (
              <div className="mt-3 flex items-start gap-3 bg-black/5 p-4 rounded-xl">
                <StickyNote className="h-4 w-4 text-black/40 mt-0.5" />
                <p className="text-sm text-black/70 italic leading-relaxed">
                  "{plan.delivery_notes}"
                </p>
              </div>
            )}
          </SummarySection>
        ) : (
          /* Standard Upfront Plan Schedule */
          <SummarySection 
            label="Plan Schedule" 
            editUrl={`${editBasePath}/edit-structure`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-black/20 flex-shrink-0" />
                <span className="font-bold font-['Playfair_Display',_serif] text-lg capitalize">
                  {plan.frequency} Plan — {plan.years} {plan.years === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              
              <div className="bg-black/5 rounded-2xl p-6">
                <h5 className="text-xs font-bold tracking-widest uppercase text-black mb-4">
                  {isOrdering ? 'Planned Deliveries' : 'Upcoming Deliveries'}
                </h5>
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
        )}

        {(isSingleDelivery && isOrdering && mainMessage) && (
          /* Single Delivery Highlights the Message as a Top-Level section in ordering */
          <SummarySection 
            label="Card Message" 
            editUrl={`${editBasePath}/structure`}
          >
            <div className="flex items-start bg-[var(--colorgreen)]/10 rounded-2xl border border-[var(--colorgreen)]/20 p-4">
              <MessageSquare className="h-5 w-5 text-[var(--colorgreen)] mt-1 flex-shrink-0 mr-4" />
              <p className="text-lg font-medium italic text-black/80 leading-relaxed">
                "{mainMessage}"
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

export default UpfrontSummary;
