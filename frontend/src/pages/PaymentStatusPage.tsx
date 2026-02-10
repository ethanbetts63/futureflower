// foreverflower/frontend/src/pages/PaymentStatusPage.tsx
import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntentResult } from '@stripe/stripe-js';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';

const UniversalPaymentStatusPage: React.FC = () => {
    const stripe = useStripe();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [message, setMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);
    const [tryAgainPath, setTryAgainPath] = useState('/dashboard');

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const piClientSecret = searchParams.get('payment_intent_client_secret');
        const siClientSecret = searchParams.get('setup_intent_client_secret');
        const clientSecret = piClientSecret || siClientSecret;

        const planId = searchParams.get('plan_id');
        const source = searchParams.get('source');
        const itemType = searchParams.get('itemType'); // ADDED

        if (planId) {
            let path = '/dashboard'; // Default
            if (source === 'checkout') { // Source is now just 'checkout'
                // We could add more specific logic here if needed, but for now, back to the plan.
                const planType = itemType === 'SUBSCRIPTION_PLAN_NEW' ? 'subscription-plan' : 'upfront-plan'; // Using itemType
                path = `/subscribe-flow/${planType}/${planId}/payment`; // A guess, might need refinement
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
                        setMessage('Success! Your payment method has been saved. Your subscription is being activated.');
                        // In a real app, you'd poll your backend here to confirm subscription is 'active'
                        // before redirecting. For now, a simple redirect will do.
                        setTimeout(() => {
                            const targetPath = (planId && planId !== "N/A") ? `/dashboard/subscription-plans/${planId}/overview` : '/dashboard';
                            navigate(targetPath);
                        }, 3000);
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
                            ? 'Success! Your plan has been updated.'
                            : 'Success! Your payment was received.';
                        
                        setMessage(`${successMessage} Redirecting to your plan overview...`);
                        
                        setTimeout(() => {
                            let targetPath = '/dashboard';
                            if (planId && planId !== "N/A") {
                                // All upfront-related payments (including single delivery) should go to the upfront plan overview
                                if (itemType && (itemType.startsWith('UPFRONT_PLAN') || itemType === 'SINGLE_DELIVERY_PLAN_NEW')) {
                                    targetPath = `/dashboard/upfront-plans/${planId}/overview`;
                                } else {
                                    targetPath = '/dashboard'; // Default fallback
                                }
                            }
                            navigate(targetPath);
                        }, 3000);
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
                <Seo title="Payment Status | ForeverFlower" />
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
                                <p className="text-lg mb-6">{message}</p>
                                {!paymentSucceeded && (
                                    <Button asChild>
                                        <Link to={tryAgainPath}>Try Again</Link>
                                    </Button>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// The page needs to be wrapped in the Elements provider to use the `useStripe` hook.
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const WrappedPaymentStatusPage = () => (
    <Elements stripe={stripePromise}>
        <UniversalPaymentStatusPage />
    </Elements>
);

export default WrappedPaymentStatusPage;
