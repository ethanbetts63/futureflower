// futureflower/frontend/src/pages/PaymentStatusPage.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntentResult } from '@stripe/stripe-js';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared_components/ui/card';
import { Button } from '@/shared_components/ui/button';
import { Spinner } from '@/shared_components/ui/spinner';
import ImpactTile from '@/shared_components/form_flow/ImpactTile';
import { getGuestOrder } from '@/api/guestCheckout';
import { formatDate, capitalize } from '@/lib/utils';
import type { Order } from '@/types';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 15; // 30 seconds max

const UniversalPaymentStatusPage = () => {
    const stripe = useStripe();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [message, setMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);
    const [tryAgainPath, setTryAgainPath] = useState('/');
    const [plan, setPlan] = useState<Order | null>(null);
    const [planLoading, setPlanLoading] = useState(true);

    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // The order summary is decoration for the wait — if it can't load
    // (expired cookie, direct visit), the status flow works without it. A
    // skeleton holds its space while it loads so the card doesn't pop in.
    useEffect(() => {
        getGuestOrder()
            .then(setPlan)
            .catch(() => {})
            .finally(() => setPlanLoading(false));
    }, []);

    // The guest checkout cookie identifies the order, so no id is needed here.
    // Always clears any interval already running: without this, a re-fire of
    // the effect below (a dependency changing, or React's dev-mode double
    // invoke) would orphan the previous interval — it keeps polling, and its
    // own clearInterval calls the *new* interval's id instead of its own,
    // silently killing the active poller mid-wait.
    const pollUntilActive = () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        let attempts = 0;

        pollIntervalRef.current = setInterval(async () => {
            attempts++;
            try {
                const order = await getGuestOrder();
                if (order.status === 'active') {
                    clearInterval(pollIntervalRef.current!);
                    setMessage('Payment confirmed. For refunds or subscription changes, contact our support team from the email address used at checkout.');
                    setIsProcessing(false);
                    return;
                }
            } catch {
                // Network error — keep trying until max attempts
            }

            if (attempts >= MAX_POLL_ATTEMPTS) {
                clearInterval(pollIntervalRef.current!);
                setMessage(
                    'Your payment was received but activation is taking a little longer than expected. ' +
                    'Redirecting you now — your plan may take a moment to show as active.'
                );
                setIsProcessing(false);
            }
        }, POLL_INTERVAL_MS);
    };

    useEffect(() => {
        if (!stripe) return;

        // Guards the async retrievePaymentIntent callback below: if this
        // effect re-fires before that promise resolves (dev-mode double
        // invoke, or a dependency changing), the stale run must not touch
        // state or start a poll interval after its own cleanup already ran.
        let cancelled = false;

        const clientSecret = searchParams.get('payment_intent_client_secret');

        const planId = searchParams.get('plan_id');
        const source = searchParams.get('source');

        if (planId) {
            setTryAgainPath('/');
        }

        if (!clientSecret) {
            setIsProcessing(false);
            setMessage("Error: Payment information not found.");
            return;
        }

        // Handle PaymentIntent
        if (clientSecret.startsWith('pi_')) {
            stripe.retrievePaymentIntent(clientSecret).then((result: PaymentIntentResult) => {
                if (cancelled) return;

                if (result.error) {
                    setIsProcessing(false);
                    setMessage(result.error.message || 'An error occurred while retrieving payment status.');
                    setPaymentSucceeded(false);
                    return;
                }

                setIsProcessing(false);
                const paymentIntent = result.paymentIntent;

                switch (paymentIntent?.status) {
                    case 'succeeded': {
                        setPaymentSucceeded(true);
                        const successMessage = source === 'upfront-management'
                            ? 'Payment confirmed! Your plan is being updated...'
                            : 'Payment confirmed! Your plan is being activated...';
                        setMessage(successMessage);

                        if (planId && planId !== "N/A") {
                            pollUntilActive();
                        } else {
                            setMessage('Payment confirmed. For refunds or subscription changes, contact our support team from the email address used at checkout.');
                        }
                        break;
                    }
                    case 'processing':
                        setMessage("Payment processing. We'll update you when payment is received.");
                        break;
                    case 'requires_payment_method':
                        setPaymentSucceeded(false);
                        setMessage('Payment failed. Please try another payment method.');
                        break;
                    default:
                        setPaymentSucceeded(false);
                        setMessage('Something went wrong.');
                        break;
                }
            });
        } else {
            setIsProcessing(false);
            setMessage("Invalid payment secret provided.");
        }

        return () => {
            cancelled = true;
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, [stripe, router, searchParams]);

    const isSubscription = plan?.billing_mode === 'recurring';

    return (
        <div className="min-h-screen w-full flex items-center py-12" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl px-4">
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Payment Status</CardTitle>
                        <CardDescription>The result of your transaction is shown below.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        {planLoading && (
                            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-black/5 bg-black/[0.02] p-4 text-left animate-pulse" aria-hidden="true">
                                <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-black/10" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="h-5 w-40 rounded bg-black/10" />
                                    <div className="h-3.5 w-56 rounded bg-black/5" />
                                </div>
                                <div className="flex-shrink-0 space-y-2 text-right">
                                    <div className="ml-auto h-3 w-10 rounded bg-black/5" />
                                    <div className="ml-auto h-5 w-16 rounded bg-black/10" />
                                </div>
                            </div>
                        )}
                        {!planLoading && plan && (
                            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-black/5 bg-black/[0.02] p-4 text-left">
                                <ImpactTile
                                    budget={Number(plan.budget)}
                                    truncateName
                                    className="min-w-0 flex-1"
                                    subtitle={
                                        isSubscription
                                            ? `${capitalize(plan.frequency)} subscription — first delivery ${formatDate(plan.start_date)}`
                                            : `Single delivery — ${formatDate(plan.start_date)}`
                                    }
                                />
                                <div className="flex-shrink-0 text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Total</p>
                                    <p className="text-lg font-bold text-black font-playfair-display">
                                        ${Number(plan.total_amount).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}
                        {isProcessing ? (
                            <div className="flex flex-col items-center gap-4">
                                <Spinner className="h-10 w-10" />
                                <p>Verifying payment status...</p>
                            </div>
                        ) : (
                            <>
                                {paymentSucceeded ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Spinner className="h-10 w-10" />
                                        <p className="text-lg">{message}</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-lg mb-6">{message}</p>
                                        <Button asChild>
                                            <Link href={tryAgainPath}>Try Again</Link>
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

const WrappedPaymentStatusPage = () => (
    <Elements stripe={stripePromise}>
        <UniversalPaymentStatusPage />
    </Elements>
);

export default WrappedPaymentStatusPage;
