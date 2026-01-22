// src/pages/flow/PaymentPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { getFlowerPlan, createPaymentIntent } from '@/api';
import type { FlowerPlan } from '@/api';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Seo from '@/components/Seo';
import CheckoutForm from '../../forms/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PlanSummary: React.FC<{ plan: FlowerPlan }> = ({ plan }) => (
  <Card className="bg-white shadow-md border-none text-black">
    <CardHeader>
      <CardTitle>Your Flower Plan</CardTitle>
      <CardDescription>Review your one-time payment details below.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex justify-between">
        <span>Plan Duration</span>
        <span>{plan.years} {plan.years > 1 ? 'Years' : 'Year'}</span>
      </div>
      <div className="flex justify-between">
        <span>Deliveries per Year</span>
        <span>{plan.deliveries_per_year}</span>
      </div>
      <div className="flex justify-between">
        <span>Budget per Bouquet</span>
        <span>${Number(plan.budget).toFixed(2)}</span>
      </div>
      <div className="border-t my-2"></div>
      <div className="flex justify-between text-xl font-bold">
        <span>Total Amount</span>
        <span>${Number(plan.total_amount).toFixed(2)} {plan.currency.toUpperCase()}</span>
      </div>
    </CardContent>
  </Card>
);

export default function PaymentPage() {
  const { planId } = useParams<{ planId: string }>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [flowerPlan, setFlowerPlan] = useState<FlowerPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) {
      setError('No Plan ID provided.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getFlowerPlan(planId)
      .then(planData => {
        setFlowerPlan(planData);
        // Now that we have the plan, create the payment intent
        return createPaymentIntent(planData.id);
      })
      .then(intentData => {
        setClientSecret(intentData.clientSecret);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load plan details or initialize payment.');
        toast.error('An error occurred', {
          description: err.message || 'Please try refreshing the page.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [planId]);

  if (error) {
    // Navigate away if there's a critical error
    toast.error("Invalid payment state", { description: error });
    return <Navigate to="/dashboard" replace />;
  }

  const appearance: Appearance = {
    theme: 'stripe',
  };

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance,
  };

  return (
    <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
      <div className="container mx-auto px-4">
        <Seo title="Secure Payment | ForeverFlower" />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Complete Your Payment</h1>
          <p className="text-muted-foreground">Secure your ForeverFlower plan.</p>
        </div>

        <div className="flex flex-col md:flex-row md:gap-12">
          {/* Left Column (Payment Form) */}
          <div className="order-2 md:order-1 w-full">
              {isLoading || !clientSecret || !flowerPlan ? (
                  <Card className="bg-white text-black border-none shadow-md">
                      <CardHeader>
                          <CardTitle className="text-3xl">Payment Details</CardTitle>
                          <CardDescription>Enter your card information below.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <div className="flex justify-center items-center h-48">
                              <Spinner className="h-12 w-12" />
                              <p className="ml-4 text-lg">Initializing payment gateway...</p>
                          </div>
                      </CardContent>
                  </Card>
              ) : (
                  <Card className="bg-white text-black border-none shadow-md">
                      <CardHeader>
                          <div className="text-center text-sm pb-2">
                              <p>Powered by <span className="font-bold">Stripe</span></p>
                          </div>
                          <CardTitle className="text-3xl">Payment Details</CardTitle>
                          <CardDescription>Enter your card information below.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Elements options={options} stripe={stripePromise}>
                              <CheckoutForm planId={flowerPlan.id.toString()} />
                          </Elements>
                      </CardContent>
                  </Card>
              )}
          </div>

          {/* Right Column (Summary) */}
          <div className="order-1 md:order-2 w-full mb-8 md:mb-0">
            {isLoading || !flowerPlan ? (
              <Card>
                  <CardHeader>
                      <CardTitle>Loading Plan...</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-48">
                      <Spinner className="h-12 w-12" />
                  </CardContent>
              </Card>
            ) : (
              <PlanSummary plan={flowerPlan} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}