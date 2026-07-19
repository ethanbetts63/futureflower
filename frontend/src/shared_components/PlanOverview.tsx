"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import FlowBackButton from '@/shared_components/form_flow/FlowBackButton';
import PlanActivationBanner from '@/shared_components/PlanActivationBanner';
import UnifiedSummaryCard from '@/shared_components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/shared_components/SummarySection';
import RecipientSummary from '@/shared_components/form_flow/RecipientSummary';
import CardMessageSummary from '@/shared_components/form_flow/CardMessageSummary';
import SubscriptionScheduleSummary from '@/shared_components/form_flow/SubscriptionScheduleSummary';
import FlowerPreferencesSummary from '@/shared_components/form_flow/FlowerPreferencesSummary';
import ImpactSummary from '@/shared_components/form_flow/ImpactSummary';
import PaymentHistoryCard from '@/shared_components/PaymentHistoryCard';
import { cancelOrder } from '@/api/orders';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared_components/ui/alert-dialog';
import type { Order } from '@/types/Order';

interface PlanOverviewProps {
  plan: Order;
}

/**
 * The dashboard view of an order that already exists: read-only detail plus
 * cancellation. Editing happens on the dedicated /dashboard/orders/:id/edit-*
 * pages, so nothing here is editable in place.
 *
 * Its pre-payment counterpart is OrderDetails.
 */
const PlanOverview = ({ plan }: PlanOverviewProps) => {
  const router = useRouter();
  const orderId = String(plan.id);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const isRecurring = plan.billing_mode === 'recurring';
  const events = plan.events;

  // Only one-off deliveries carry a card message. Once paid it lives on the event.
  const cardMessage = isRecurring ? '' : (plan.card_message || events[0]?.message || '');

  const handleCancelPlan = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await cancelOrder(orderId);
      setCancelDialogOpen(false);
      toast.success('Your plan has been cancelled. To request a refund for remaining deliveries, email admin@futureflower.app.');
      router.push('/order-support');
    } catch {
      setCancelError('Something went wrong. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = plan.status === 'active';

  return (
    <div className="space-y-8">
      {plan.status !== 'active' && <PlanActivationBanner planId={orderId} />}

      <UnifiedSummaryCard
        title={isRecurring ? "Subscription Overview" : "Plan Overview"}
        description={isRecurring
          ? "Review and manage the details of your active flower subscription."
          : "Review and manage the details of your scheduled flower plan."}
        footer={
          <div className="flex justify-start items-center w-full">
            <FlowBackButton to="/order-support" />
          </div>
        }
      >
        <SummarySection label="Billing History">
          <PaymentHistoryCard plan={plan} />
        </SummarySection>

        <RecipientSummary plan={plan} />

        {isRecurring ? (
          <SubscriptionScheduleSummary plan={plan} />
        ) : (
          <SummarySection label="Plan Schedule">
            <div className="flex flex-col gap-4">
              <div className="bg-black/5 rounded-2xl p-6">
                <h5 className="text-xs font-bold tracking-widest uppercase text-black mb-4">
                  Upcoming Deliveries
                </h5>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between border-b border-black/5 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-black/30" />
                        <span className="text-sm font-medium">{formatDate(event.delivery_date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SummarySection>
        )}

        {cardMessage && <CardMessageSummary message={cardMessage} />}

        <FlowerPreferencesSummary flowerNotes={plan.flower_notes} />

        <ImpactSummary price={Number(plan.budget)} />

        {canCancel && (
          <SummarySection label="Danger Zone">
            <div className="border border-red-200 rounded-2xl p-5 bg-red-50/50">
              <p className="text-sm text-black/60 mb-4">
                {isRecurring
                  ? "Budget, frequency, and delivery style can't be changed on an active subscription. Cancel this one and start a new order to change them — you can choose to keep your next scheduled delivery or cancel everything immediately."
                  : 'Cancelling this plan will stop all future deliveries. If you have paid upfront for remaining deliveries, you can request a refund by email.'}
              </p>
              {cancelError && (
                <p className="text-red-500 text-sm mb-3">{cancelError}</p>
              )}
              <button
                onClick={() => setCancelDialogOpen(true)}
                className="text-red-600 font-semibold text-sm underline hover:text-red-700 transition-colors cursor-pointer"
              >
                {isRecurring ? 'Cancel Subscription' : 'Cancel this plan'}
              </button>
            </div>
          </SummarySection>
        )}
      </UnifiedSummaryCard>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this plan?</AlertDialogTitle>
            <AlertDialogDescription>
              All upcoming scheduled deliveries will be cancelled. This cannot be undone.
              To request a refund for remaining deliveries, email admin@futureflower.app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Go back</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancelPlan();
              }}
              disabled={isCancelling}
              className="bg-black text-white hover:bg-black/80"
            >
              {isCancelling ? 'Cancelling...' : 'Yes, cancel plan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlanOverview;
