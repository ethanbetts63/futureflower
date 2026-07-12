"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, MessageSquare, RefreshCw, Tag, StickyNote } from 'lucide-react';
import EditControl from '@/components/EditControl';
import { MIN_DAYS_BEFORE_EDIT, MS_PER_DAY } from '@/utils/systemConstants';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import PlanActivationBanner from '@/components/PlanActivationBanner';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import RecipientSummary from '@/components/form_flow/RecipientSummary';
import FlowerPreferencesSummary from '@/components/form_flow/FlowerPreferencesSummary';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';
import DiscountCodeInput from '@/components/form_flow/DiscountCodeInput';
import PaymentHistoryCard from '@/components/PaymentHistoryCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { acceptTerms } from '@/api';
import { cancelOrder, makeOrderRecurring, startCheckout } from '@/api/orders';
import { formatDate } from '@/utils/utils';
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
} from '@/components/ui/alert-dialog';
import type { UpfrontSummaryProps } from '@/types/UpfrontSummaryProps';
import type { FlowerType } from '@/types/FlowerType';

const UpfrontSummary = ({
  plan,
  flowerTypeMap,
  context,
  planId,
  onRefreshPlan,
}: UpfrontSummaryProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [makeRecurring, setMakeRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [recurringPreferences, setRecurringPreferences] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const handleCancelPlan = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await cancelOrder(planId);
      setCancelDialogOpen(false);
      toast.success('Your plan has been cancelled. To request a refund for remaining deliveries, email ethan.betts.dev@gmail.com.');
      router.push('/dashboard');
    } catch {
      setCancelError('Something went wrong. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const isOrdering = context === 'ordering';
  const isSingleDelivery = plan.billing_mode === 'one_time';

  // Base paths for editing
  const editBasePath = isOrdering
    ? `/single-delivery-flow/plan/${planId}`
    : `/dashboard/upfront-plans/${planId}`;

  const preferredTypes = plan.preferred_flower_types
    .map(id => flowerTypeMap.get(Number(id)))
    .filter((ft): ft is FlowerType => !!ft);

  const messages = plan.draft_card_messages || {};
  const events = plan.events || [];

  // Lock all edits if the nearest upcoming delivery is within the edit lead time
  const nearestUpcomingDays = events
    .map(e => Math.floor((new Date(e.delivery_date).getTime() - Date.now()) / MS_PER_DAY))
    .filter(d => d > 0)
    .sort((a, b) => a - b)[0];
  const isSectionEditLocked = !isOrdering && nearestUpcomingDays !== undefined && nearestUpcomingDays <= MIN_DAYS_BEFORE_EDIT;

  // For Single Delivery or context where we want to highlight the main message
  const firstDraftMessage = messages['0'] || '';
  const firstEventMessage = events[0]?.message || '';
  const mainMessage = firstDraftMessage || firstEventMessage;

  const handleRecurringPayment = async () => {
    if (!planId) return;

    setIsSubmitting(true);
    try {
      const recurringOrder = await makeOrderRecurring(planId, {
        frequency: recurringFrequency,
        recurring_preferences: recurringPreferences,
        subscription_message: mainMessage,
      });
      const response = await startCheckout(recurringOrder.id);

      sessionStorage.setItem('checkoutState', JSON.stringify({
        clientSecret: response.clientSecret,
        planId: String(recurringOrder.id),
        intentType: 'payment',
        backPath: `${editBasePath}/confirmation`,
      }));
      router.push('/checkout');
    } catch (err: any) {
      toast.error("Checkout Error", {
        description: err.message || "Could not initiate the recurring payment. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {isOrdering ? (
        <StepProgressBar
          planName="Single Delivery"
          currentStep={4}
          totalSteps={4}
          isReview={true}
        />
      ) : (
        plan.status !== 'active' && <PlanActivationBanner planId={planId} />
      )}

      <UnifiedSummaryCard
        title={isOrdering ? "Confirm Your Delivery" : "Plan Overview"}
        description={isOrdering
          ? "Please review the details of your order before proceeding to payment."
          : "Review and manage the details of your scheduled flower plan."
        }
        footer={
          isOrdering ? (
            <div className="flex flex-row justify-between items-center w-full gap-4">
              <FlowBackButton to={`${editBasePath}/structure`} />
              {makeRecurring ? (
                <Button
                  onClick={handleRecurringPayment}
                  disabled={isSubmitting || !planId || !termsAccepted}
                  className="bg-[var(--colorgreen)] text-black font-normal px-6 py-3 rounded-xl hover:bg-[#22c55e] hover:shadow-xl transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-4 min-w-[200px] border-none text-base"
                >
                  <span className="flex items-center gap-2">
                    {isSubmitting && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Next: Payment
                  </span>
                </Button>
              ) : (
                <PaymentInitiatorButton
                  orderId={planId}
                  backPath={`${editBasePath}/confirmation`}
                  disabled={isSubmitting || !planId || !termsAccepted}
                  onPaymentInitiate={() => setIsSubmitting(true)}
                  onPaymentError={() => setIsSubmitting(false)}
                >
                  Next: Payment
                </PaymentInitiatorButton>
              )}
            </div>
          ) : (
            <div className="flex justify-start items-center w-full">
              <FlowBackButton to="/dashboard" />
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
          locked={isSectionEditLocked}
        />

        {isSingleDelivery && isOrdering ? (
          /* Specialized Single Delivery Schedule for Ordering */
          <SummarySection
            label="Delivery Date"
            editUrl={`${editBasePath}/structure`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-black/20 flex-shrink-0" />
              <span className="font-bold font-playfair-display text-lg">
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
          >
            <div className="flex flex-col gap-4">
              <div className="bg-black/5 rounded-2xl p-6">
                <h5 className="text-xs font-bold tracking-widest uppercase text-black mb-4">
                  {isOrdering ? 'Planned Deliveries' : 'Upcoming Deliveries'}
                </h5>
                <div className="space-y-4">
                  {events.map((event, idx) => {
                    const daysUntilDelivery = event.delivery_date
                      ? Math.floor((new Date(event.delivery_date).getTime() - Date.now()) / MS_PER_DAY)
                      : 0;
                    const showEditControl = !isOrdering && daysUntilDelivery > 0;
                    const isRowLocked = daysUntilDelivery <= MIN_DAYS_BEFORE_EDIT;
                    return (
                      <div key={idx} className="flex items-center justify-between border-b border-black/5 last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-black/30" />
                          <span className="text-sm font-medium">{formatDate(event.delivery_date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {showEditControl && (
                            <EditControl
                              editUrl={`/dashboard/upfront-plans/${planId}/edit-structure`}
                              locked={isRowLocked}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </SummarySection>
        )}

        {mainMessage && (
          <SummarySection
            label="Card Message"
            editUrl={isOrdering ? `${editBasePath}/structure` : `${editBasePath}/edit-structure`}
            locked={isSectionEditLocked}
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
          locked={isSectionEditLocked}
        />

        <ImpactSummary
          price={Number(plan.budget)}
          editUrl={isOrdering ? `${editBasePath}/structure` : undefined}
        />

        {isOrdering && (
          <SummarySection label="Recurring Delivery">
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={makeRecurring}
                  onCheckedChange={(checked) => setMakeRecurring(checked === true)}
                  className="mt-1 flex-shrink-0"
                />
                <span>
                  <span className="block font-semibold text-black">Make this a recurring delivery</span>
                  <span className="mt-1 block text-sm leading-relaxed text-black/60">
                    Use this florist brief as the starting point, then let the florist vary future deliveries based on your instructions.
                  </span>
                </span>
              </label>

              {makeRecurring && (
                <div className="grid gap-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                  <div className="grid gap-2">
                    <label htmlFor="recurring-frequency" className="text-sm font-semibold text-black">
                      Delivery Frequency
                    </label>
                    <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                      <SelectTrigger id="recurring-frequency" className="bg-white">
                        <SelectValue placeholder="Choose frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="fortnightly">Fortnightly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="recurring-preferences" className="text-sm font-semibold text-black">
                      Custom Subscription Preferences
                    </label>
                    <Textarea
                      id="recurring-preferences"
                      value={recurringPreferences}
                      onChange={(event) => setRecurringPreferences(event.target.value)}
                      placeholder="Keep each delivery varied, follow the same colour palette, use seasonal flowers, avoid lilies, or anything else the florist should know."
                      rows={4}
                      className="bg-white"
                    />
                  </div>

                  <div className="flex items-start gap-3 text-sm leading-relaxed text-black/60">
                    <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-black/35" />
                    <p>
                      Your first delivery is charged now. Future deliveries are charged before each scheduled delivery.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SummarySection>
        )}

        {isOrdering && (
          <SummarySection label="Promotions">
            <div className="flex items-start gap-3 mt-1">
              <Tag className="h-5 w-5 text-black/20 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <DiscountCodeInput
                  planId={planId}
                  existingCode={plan.discount_code_display}
                  onDiscountApplied={() => onRefreshPlan?.()}
                />
              </div>
            </div>
          </SummarySection>
        )}

        {isOrdering && (
          <SummarySection label="Terms & Conditions">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  const accepted = checked === true;
                  setTermsAccepted(accepted);
                  if (accepted) acceptTerms('customer').catch(console.error);
                }}
                className="mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-black/70 leading-relaxed">
                I have read and agree to the{' '}
                <Link href="/terms-and-conditions/customer" target="_blank" className="underline text-black hover:text-black/70">
                  Customer Terms & Conditions
                </Link>
                .
              </span>
            </label>
          </SummarySection>
        )}

        {!isOrdering && plan.status === 'active' && (
          <SummarySection label="Danger Zone">
            <div className="border border-red-200 rounded-2xl p-5 bg-red-50/50">
              <p className="text-sm text-black/60 mb-4">
                Cancelling this plan will stop all future deliveries. If you have paid upfront for
                remaining deliveries, you can request a refund by email.
              </p>
              {cancelError && (
                <p className="text-red-500 text-sm mb-3">{cancelError}</p>
              )}
              <button
                onClick={() => setCancelDialogOpen(true)}
                className="text-red-600 font-semibold text-sm underline hover:text-red-700 transition-colors cursor-pointer"
              >
                Cancel this plan
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
              To request a refund for remaining deliveries, email ethan.betts.dev@gmail.com.
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

export default UpfrontSummary;
