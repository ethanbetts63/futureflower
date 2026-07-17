// futureflower/frontend/src/pages/PaymentStatusPage.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntentResult } from '@stripe/stripe-js';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getGuestOrder } from '@/api/guestCheckout';

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

    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Clean up polling on unmount
    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, []);

    // The guest checkout cookie identifies the order, so no id is needed here.
    const pollUntilActive = () => {
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
    }, [stripe, router, searchParams]);

    return (
        <div className="min-h-screen w-full flex items-center py-12" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl">
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Payment Status</CardTitle>
                        <CardDescription>The result of your transaction is shown below.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
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
