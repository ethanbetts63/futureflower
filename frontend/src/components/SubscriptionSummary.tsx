"use client";
import { useRouter } from 'next/navigation';
import { Calendar, MessageSquare, RefreshCw } from 'lucide-react';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import PlanActivationBanner from '@/components/PlanActivationBanner';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import RecipientSummary from '@/components/form_flow/RecipientSummary';
import FlowerPreferencesSummary from '@/components/form_flow/FlowerPreferencesSummary';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import PaymentHistoryCard from '@/components/PaymentHistoryCard';
import { formatDate } from '@/utils/utils';
import type { SubscriptionSummaryProps } from '@/types/SubscriptionSummaryProps';
import type { FlowerType } from '@/types/FlowerType';

const SubscriptionSummary = ({
  plan,
  flowerTypeMap,
  planId,
}: SubscriptionSummaryProps) => {
  const router = useRouter();
  const editBasePath = `/dashboard/subscription-plans/${planId}`;

  const preferredTypes = plan.preferred_flower_types
    .map(id => flowerTypeMap.get(Number(id)))
    .filter((ft): ft is FlowerType => !!ft);

  return (
    <div className="space-y-8">
      {plan.status !== 'active' && <PlanActivationBanner planId={planId} />}

      <UnifiedSummaryCard
        title="Subscription Overview"
        description="Review and manage the details of your active flower subscription."
        footer={
          <div className="flex justify-start items-center w-full">
            <FlowBackButton to="/dashboard" />
          </div>
        }
      >
        <SummarySection label="Billing History">
          <PaymentHistoryCard plan={plan} />
        </SummarySection>

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
              <span className="font-bold font-playfair-display text-lg capitalize">
                {plan.frequency}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-black/20 flex-shrink-0" />
              <span className="text-black/60">
                Next delivery on {plan.start_date ? formatDate(plan.start_date) : 'Not set'}
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

        {plan.status === 'active' && (
          <SummarySection label="Danger Zone">
            <div className="border border-red-200 rounded-2xl p-5 bg-red-50/50">
              <p className="text-sm text-black/60 mb-4">
                Cancelling your subscription will stop future charges. You can choose to keep your
                next scheduled delivery or cancel everything immediately.
              </p>
              <button
                onClick={() => router.push(`/dashboard/subscription-plans/${planId}/cancel`)}
                className="text-red-600 font-semibold text-sm underline hover:text-red-700 transition-colors cursor-pointer"
              >
                Cancel Subscription
              </button>
            </div>
          </SummarySection>
        )}
      </UnifiedSummaryCard>
    </div>
  );
};

export default SubscriptionSummary;
