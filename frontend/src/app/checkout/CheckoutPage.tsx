// futureflower/frontend/src/pages/CheckoutPage.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { Spinner } from '@/shared_components/ui/spinner';
import CheckoutForm from '@/app/checkout/CheckoutForm';
import FlowBackButton from '@/shared_components/form_flow/FlowBackButton';
import StepProgressBar from '@/shared_components/form_flow/StepProgressBar';
import UnifiedSummaryCard from '@/shared_components/form_flow/UnifiedSummaryCard';
import OrderTotalSummary from '@/shared_components/form_flow/OrderTotalSummary';
import OrderReviewGrid from '@/shared_components/form_flow/OrderReviewGrid';
import SummarySection from '@/shared_components/SummarySection';
import { ShieldCheck } from 'lucide-react';
import { getGuestOrder } from '@/api/guestCheckout';
import type { Order } from '@/types';

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
            // sessionStorage does not exist while this renders on the server, so
            // the handoff from the confirmation page can only be read after mount
            // — it cannot move into a lazy useState initializer.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setClientSecret(secret);
            setPlanId(id);
            setBackPath(back);

            getGuestOrder()
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
    const planName = planIsSubscription ? "Flower Subscription" : "Single Delivery";

    return (
        <>
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
                        <OrderReviewGrid plan={plan} />

                        <OrderTotalSummary plan={plan} isSubscription={planIsSubscription} />

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
