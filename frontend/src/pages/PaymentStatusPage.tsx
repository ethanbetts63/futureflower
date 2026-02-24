// futureflower/frontend/src/pages/PaymentStatusPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntentResult } from '@stripe/stripe-js';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { getUpfrontPlan } from '@/api/upfrontPlans';
import { getSubscriptionPlan } from '@/api/subscriptionPlans';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 15; // 30 seconds max

const UniversalPaymentStatusPage: React.FC = () => {
    const stripe = useStripe();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [message, setMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);
    const [tryAgainPath, setTryAgainPath] = useState('/dashboard');

    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Clean up polling on unmount
    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        };
    }, []);

    const pollUntilActive = (
        planId: string,
        targetPath: string,
        itemType: string | null,
    ) => {
        let attempts = 0;

        const getPlan = (itemType === 'SUBSCRIPTION_PLAN_NEW')
            ? () => getSubscriptionPlan(planId)
            : () => getUpfrontPlan(planId);

        pollIntervalRef.current = setInterval(async () => {
            attempts++;
            try {
                const plan = await getPlan();
                if (plan.status === 'active') {
                    clearInterval(pollIntervalRef.current!);
                    navigate(targetPath);
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
                setTimeout(() => navigate(targetPath), 3000);
            }
        }, POLL_INTERVAL_MS);
    };

    useEffect(() => {
        if (!stripe) return;

        const piClientSecret = searchParams.get('payment_intent_client_secret');
        const siClientSecret = searchParams.get('setup_intent_client_secret');
        const clientSecret = piClientSecret || siClientSecret;

        const planId = searchParams.get('plan_id');
        const source = searchParams.get('source');
        const itemType = searchParams.get('itemType');

        if (planId) {
            let path = '/dashboard';
            if (source === 'checkout') {
                const planType = itemType === 'SUBSCRIPTION_PLAN_NEW' ? 'subscription-plan' : 'upfront-plan';
                path = `/subscribe-flow/${planType}/${planId}/payment`;
            }
            setTryAgainPath(path);
        }

        if (!clientSecret) {
            setIsProcessing(false);
            setMessage("Error: Payment information not found.");
            return;
        }

        // Handle SetupIntent
        if (clientSecret.startsWith('seti_')) {
            stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
                setIsProcessing(false);
                switch (setupIntent?.status) {
                    case 'succeeded':
                        setPaymentSucceeded(true);
                        setMessage('Payment confirmed! Your subscription is being activated...');
                        if (planId && planId !== "N/A") {
                            const targetPath = `/dashboard/subscription-plans/${planId}/overview`;
                            pollUntilActive(planId, targetPath, 'SUBSCRIPTION_PLAN_NEW');
                        } else {
                            setTimeout(() => navigate('/dashboard'), 3000);
                        }
                        break;
                    case 'processing':
                        setMessage("Processing setup. We'll update you when your payment method is saved.");
                        break;
                    case 'requires_payment_method':
                        setPaymentSucceeded(false);
                        setMessage('Setup failed. Please try another payment method.');
                        break;
                    default:
                        setPaymentSucceeded(false);
                        setMessage('Something went wrong during setup.');
                        break;
                }
            });
        }
        // Handle PaymentIntent
        else if (clientSecret.startsWith('pi_')) {
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
                    case 'succeeded':
                        setPaymentSucceeded(true);
                        const successMessage = source === 'upfront-management'
                            ? 'Payment confirmed! Your plan is being updated...'
                            : 'Payment confirmed! Your plan is being activated...';
                        setMessage(successMessage);

                        if (planId && planId !== "N/A") {
                            let targetPath = '/dashboard';
                            if (itemType && (itemType.startsWith('UPFRONT_PLAN') || itemType === 'SINGLE_DELIVERY_PLAN_NEW')) {
                                targetPath = `/dashboard/upfront-plans/${planId}/overview`;
                            } else if (itemType === 'SUBSCRIPTION_PLAN_NEW') {
                                targetPath = `/dashboard/subscription-plans/${planId}/overview`;
                            }
                            pollUntilActive(planId, targetPath, itemType);
                        } else {
                            setTimeout(() => navigate('/dashboard'), 3000);
                        }
                        break;
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
    }, [stripe, navigate, searchParams]);

    return (
        <div className="min-h-screen w-full flex items-center py-12" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl">
                <Seo title="Payment Status | FutureFlower" />
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
                                            <Link to={tryAgainPath}>Try Again</Link>
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const WrappedPaymentStatusPage = () => (
    <Elements stripe={stripePromise}>
        <UniversalPaymentStatusPage />
    </Elements>
);

export default WrappedPaymentStatusPage;
