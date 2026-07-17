"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, RefreshCw, Tag, StickyNote } from 'lucide-react';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import FlowNextButton from '@/components/form_flow/FlowNextButton';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import RecipientSummary from '@/components/form_flow/RecipientSummary';
import CardMessageSummary from '@/components/form_flow/CardMessageSummary';
import SubscriptionScheduleSummary from '@/components/form_flow/SubscriptionScheduleSummary';
import FlowerPreferencesSummary from '@/components/form_flow/FlowerPreferencesSummary';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import PaymentInitiatorButton from '@/components/form_flow/PaymentInitiatorButton';
import DiscountCodeInput from '@/components/form_flow/DiscountCodeInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { acceptGuestTerms, claimGuestCheckout, makeGuestOrderRecurring, startGuestCheckoutPayment } from '@/api/guestCheckout';
import { formatDate } from '@/utils/utils';
import { errorMessage } from '@/utils/errors';
import { toast } from 'sonner';
import type { Order } from '@/types/Order';

const EDIT_BASE_PATH = '/order';

interface OrderConfirmationProps {
  plan: Order;
  onRefreshPlan?: () => void;
}

/**
 * The final step of the guest ordering flow: review the brief, add contact
 * details, optionally turn it into a subscription, and pay.
 *
 * Its read-only counterpart for an order that already exists is PlanOverview.
 */
const OrderConfirmation = ({ plan, onRefreshPlan }: OrderConfirmationProps) => {
  const router = useRouter();
  // The guest flow carries no id in the URL — the checkout cookie decides which
  // order this is — so the loaded plan is the only trustworthy source for one.
  const orderId = String(plan.id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [makeRecurring, setMakeRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [recurringPreferences, setRecurringPreferences] = useState('');
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const isRecurring = plan.billing_mode === 'recurring';

  // Only one-off deliveries carry a card message.
  const cardMessage = isRecurring ? '' : (plan.card_message || '');

  const handleRecurringPayment = async () => {
    setIsSubmitting(true);
    try {
      await claimGuestCheckout({ email: customerEmail, first_name: customerFirstName, last_name: customerLastName });
      const recurringOrder = await makeGuestOrderRecurring({
        frequency: recurringFrequency,
        recurring_preferences: recurringPreferences,
      });
      const response = await startGuestCheckoutPayment();

      sessionStorage.setItem('checkoutState', JSON.stringify({
        clientSecret: response.clientSecret,
        planId: String(recurringOrder.id),
        backPath: `${EDIT_BASE_PATH}/confirmation`,
      }));
      router.push('/checkout');
    } catch (err) {
      toast.error("Checkout Error", {
        description: errorMessage(err) || "Could not initiate the recurring payment. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const claimBeforePayment = async () => {
    if (!customerFirstName || !customerLastName || !customerEmail) {
      throw new Error('Enter your name and email before payment.');
    }
    await claimGuestCheckout({ email: customerEmail, first_name: customerFirstName, last_name: customerLastName });
    return startGuestCheckoutPayment();
  };

  return (
    <div className="space-y-8">
      <StepProgressBar
        planName="Single Delivery Plan"
        currentStep={3}
        totalSteps={3}
        isReview={true}
      />

      <UnifiedSummaryCard
        title="Confirm Your Delivery"
        description="Please review the details of your order before proceeding to payment."
        footer={
          <div className="flex flex-row justify-between items-center w-full gap-4">
            <FlowBackButton to={`${EDIT_BASE_PATH}/recipient`} />
            {makeRecurring ? (
              <FlowNextButton
                label="Next: Payment"
                onClick={handleRecurringPayment}
                isLoading={isSubmitting}
                disabled={isSubmitting || !termsAccepted}
              />
            ) : (
              <PaymentInitiatorButton
                orderId={orderId}
                backPath={`${EDIT_BASE_PATH}/confirmation`}
                disabled={isSubmitting || !termsAccepted}
                startPayment={claimBeforePayment}
                onPaymentInitiate={() => setIsSubmitting(true)}
                onPaymentError={() => setIsSubmitting(false)}
              >
                Next: Payment
              </PaymentInitiatorButton>
            )}
          </div>
        }
      >
        <RecipientSummary plan={plan} editUrl={`${EDIT_BASE_PATH}/recipient`} />

        {isRecurring ? (
          <SubscriptionScheduleSummary plan={plan} />
        ) : (
          <SummarySection label="Delivery Date" editUrl={`${EDIT_BASE_PATH}/structure`}>
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
        )}

        {cardMessage && (
          <CardMessageSummary
            message={cardMessage}
            editUrl={`${EDIT_BASE_PATH}/structure`}
            footnote={makeRecurring
              ? 'Recurring deliveries arrive without a card message, so this one won\'t be included. Untick "Make this a recurring delivery" to send it.'
              : undefined}
          />
        )}

        <FlowerPreferencesSummary
          flowerNotes={plan.flower_notes}
          editUrl={`${EDIT_BASE_PATH}/preferences`}
        />

        <ImpactSummary price={Number(plan.budget)} editUrl={`${EDIT_BASE_PATH}/structure`} />

        <SummarySection label="Your Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={customerFirstName} onChange={(event) => setCustomerFirstName(event.target.value)} placeholder="Your first name" className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm" />
            <input value={customerLastName} onChange={(event) => setCustomerLastName(event.target.value)} placeholder="Your last name" className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm" />
            <input value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="Your email" type="email" className="h-11 rounded-md border border-black/10 bg-white px-3 text-sm sm:col-span-2" />
          </div>
        </SummarySection>

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
                  Create a bouquet delivery subscription on a schedule of your choice. You can cancel anytime.
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

        <SummarySection label="Promotions">
          <div className="flex items-start gap-3 mt-1">
            <Tag className="h-5 w-5 text-black/20 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <DiscountCodeInput
                existingCode={plan.discount_code_display}
                onDiscountApplied={() => onRefreshPlan?.()}
              />
            </div>
          </div>
        </SummarySection>

        <SummarySection label="Terms & Conditions">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={termsAccepted}
              onCheckedChange={(checked) => {
                const accepted = checked === true;
                setTermsAccepted(accepted);
                if (accepted) acceptGuestTerms().catch(console.error);
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
      </UnifiedSummaryCard>
    </div>
  );
};

export default OrderConfirmation;
