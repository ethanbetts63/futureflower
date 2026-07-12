// futureflower/frontend/src/pages/CheckoutPage.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import CheckoutForm from '@/forms/CheckoutForm';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/SummarySection';
import { MapPin, Calendar, RefreshCw, DollarSign, ShieldCheck } from 'lucide-react';
import { getOrder } from '@/api/orders';
import type { Order } from '@/types';
import { formatDate, capitalize } from '@/utils/utils';
import { getImpactTier } from '@/utils/pricingConstants';
import flowerIcon from '@/assets/flower_symbol.svg';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

const CheckoutPage = () => {
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [planId, setPlanId] = useState<string | null>(null);
    const [backPath, setBackPath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [plan, setPlan] = useState<Order | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('checkoutState');
        const state = stored ? JSON.parse(stored) : null;
        const secret = state?.clientSecret;
        const id = state?.planId;
        const back = state?.backPath;

        if (secret && id) {
            setClientSecret(secret);
            setPlanId(id);
            setBackPath(back);

            getOrder(id)
                .then(setPlan)
                .catch((err) => console.error('Could not load plan summary:', err))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen" style={{ backgroundColor: 'var(--color4)' }}>
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    if (!clientSecret || !planId || !plan) {
        if (!isLoading) {
            toast.error("Checkout session is invalid or has expired.");
            router.replace('/');
            return null;
        }
        return null;
    }

    const appearance: Appearance = { theme: 'stripe' };
    const options: StripeElementsOptions = { clientSecret, appearance };

    const planIsSubscription = plan.billing_mode === 'recurring';
    const isSingleDelivery = plan.billing_mode === 'one_time';

    const fullAddress = [
        plan.recipient_street_address,
        plan.recipient_suburb,
        plan.recipient_city,
        plan.recipient_state,
        plan.recipient_postcode,
        plan.recipient_country
    ].filter(Boolean).join(', ');

    const subtotal = Number(plan.subtotal);
    const discountAmount = Number(plan.discount_amount);
    const taxAmount = Number(plan.tax_amount);
    const totalPlanAmount = Number(plan.total_amount);
    const flowerBudget = Number(plan.budget);
    const tier = getImpactTier(flowerBudget);

    const planName = planIsSubscription ? "Flower Subscription" : "Single Delivery";

    return (
        <>
            <Seo title="Complete Your Order | FutureFlower" />
            <StepProgressBar
                planName={planName}
                currentStep={4}
                totalSteps={4}
                isReview={true}
                customLabel="Payment"
            />

            <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
                <div className="container mx-auto px-0 md:px-4 max-w-4xl">
                    <UnifiedSummaryCard
                        title="Final Step: Payment"
                        description="Review your summary and complete your payment to finalize your booking."
                        footer={
                            <div className="flex flex-row items-center w-full gap-4">
                                {backPath && <FlowBackButton to={backPath} />}
                                <div className="flex-1 text-right text-xs text-black/40 flex items-center justify-end gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Secure Stripe Checkout
                                </div>
                            </div>
                        }
                    >
                        {/* Review Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Impact Selection  */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-black/5 bg-[var(--color4)] flex-shrink-0">
                                    {tier?.image ? (
                                        <img src={tier.image} alt={tier.name} className="w-full h-full object-cover" loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img src={flowerIcon} alt="" className="h-6 w-6 opacity-20" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase block mb-0.5">Selection</span>
                                    <h4 className="text-lg font-bold text-black font-playfair-display">
                                        {tier ? tier.name : 'Custom Selection'}
                                    </h4>
                                </div>
                            </div>

                            {/* Schedule - Compact */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-black/5 rounded-lg flex-shrink-0">
                                    {planIsSubscription ? <RefreshCw className="h-4 w-4 text-black/40" /> : <Calendar className="h-4 w-4 text-black/40" />}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase block mb-0.5">Schedule</span>
                                    <p className="font-bold text-black font-['Playfair_Display']">
                                        {isSingleDelivery ? `Single Delivery — ${formatDate(plan.start_date)}` : capitalize(plan.frequency)}
                                    </p>
                                    {planIsSubscription && (
                                        <p className="text-xs text-black/60">
                                            Next: {formatDate(plan.start_date)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Recipient - Compact */}
                            <div className="flex items-start gap-3 md:col-span-2 bg-black/5 p-4 rounded-2xl">
                                <MapPin className="h-4 w-4 text-black/40 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase block mb-0.5">Recipient</span>
                                    <p className="text-sm font-semibold">
                                        {plan.recipient_first_name} {plan.recipient_last_name} • <span className="text-black/60 font-normal">{fullAddress}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <SummarySection label="Order Total">
                            <div className="space-y-3 bg-black/5 rounded-2xl p-4 mt-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-black/60">Subtotal</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex items-center justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {taxAmount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-black/60">Tax</span>
                                        <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-black/60">Delivery</span>
                                    <span className="font-semibold">$0.00</span>
                                </div>
                                <div className="pt-3 border-t border-black/10 flex items-center justify-between">
                                    <span className="font-bold text-black flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-black/40" />
                                        {planIsSubscription ? 'Amount Per Delivery' : 'Total Amount Due'}
                                    </span>
                                    <span className="text-xl font-bold text-black">${totalPlanAmount.toFixed(2)}</span>
                                </div>
                                {planIsSubscription && (
                                    <p className="text-[10px] text-black/40 text-center uppercase tracking-widest mt-2">
                                        Recurring payment at the frequency selected.
                                    </p>
                                )}
                            </div>
                        </SummarySection>

                        {/* Payment Section */}
                        <SummarySection label="Payment Details">
                            <div>
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm
                                        planId={planId}
                                        source="checkout"
                                    />
                                </Elements>
                            </div>
                        </SummarySection>
                    </UnifiedSummaryCard>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;
