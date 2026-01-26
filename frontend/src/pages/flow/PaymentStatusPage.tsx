import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntentResult } from '@stripe/stripe-js';

import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';

const PaymentStatusPage: React.FC = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const [tryAgainPath, setTryAgainPath] = useState('/dashboard');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    const planId = new URLSearchParams(window.location.search).get('plan_id');

    if (planId) {
      setTryAgainPath(`/dashboard/plans/${planId}/overview`);
    }

    if (!clientSecret) {
      setIsProcessing(false);
      setMessage("Error: Payment information not found. Please check your dashboard for the status of your payment.");
      return;
    }

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
          const planId = new URLSearchParams(window.location.search).get('plan_id');
          if (planId) {
            setMessage('Success! Your payment was received. Redirecting to your plan overview...');
            setTimeout(() => {
              navigate(`/dashboard/plans/${planId}/overview`);
            }, 2000);
          } else {
            setMessage('Success! Your payment was received, but we could not find the plan details. Redirecting to dashboard.');
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
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
  }, [stripe, navigate]);

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
                        <Link to={tryAgainPath}>Return to Plan</Link>
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

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error("FATAL: VITE_STRIPE_PUBLISHABLE_KEY is not set in .env file or is not prefixed with VITE_.");
}
// Log a truncated version of the key for debugging, which is safer than logging the whole key.
console.log("Stripe.js is loading with key:", publishableKey ? `${publishableKey.substring(0, 10)}...` : "KEY NOT FOUND");

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const WrappedPaymentStatusPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentStatusPage />
  </Elements>
);

export default WrappedPaymentStatusPage;
