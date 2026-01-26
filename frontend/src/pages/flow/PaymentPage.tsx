// src/pages/flow/PaymentPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { getFlowerPlan, createPaymentIntent } from '@/api';
import type { FlowerPlan, PartialFlowerPlan } from '@/api';
import { Spinner } from '@/components/ui/spinner';
import BackButton from '@/components/BackButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Seo from '@/components/Seo';
import CheckoutForm from '../../forms/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PlanSummaryProps {
  originalPlan: FlowerPlan;
  newPlan?: PartialFlowerPlan & { amount: number };
}

const PlanSummary: React.FC<PlanSummaryProps> = ({ originalPlan, newPlan }) => {
    const displayPlan = {
        years: newPlan?.years ?? originalPlan.years,
        deliveries_per_year: newPlan?.deliveries_per_year ?? originalPlan.deliveries_per_year,
        budget: newPlan?.budget ?? originalPlan.budget,
    };
    
    const totalAmount = newPlan?.amount ?? originalPlan.total_amount;
    const title = newPlan ? "Confirm Your Changes" : "Your Flower Plan";
    const description = newPlan 
        ? "Review the changes and your one-time payment." 
        : "Review your one-time payment details below.";

  return (
    <Card className="bg-white shadow-md border-none text-black">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Plan Duration</span>
          <div className='flex items-center'>
            {newPlan && newPlan.years !== originalPlan.years && <span className="text-gray-500 line-through mr-2">{originalPlan.years} {originalPlan.years > 1 ? 'Years' : 'Year'}</span>}
            <span>{displayPlan.years} {displayPlan.years > 1 ? 'Years' : 'Year'}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Deliveries per Year</span>
           <div className='flex items-center'>
            {newPlan && newPlan.deliveries_per_year !== originalPlan.deliveries_per_year && <span className="text-gray-500 line-through mr-2">{originalPlan.deliveries_per_year}</span>}
            <span>{displayPlan.deliveries_per_year}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Budget per Bouquet</span>
           <div className='flex items-center'>
            {newPlan && newPlan.budget !== Number(originalPlan.budget) && <span className="text-gray-500 line-through mr-2">${Number(originalPlan.budget).toFixed(2)}</span>}
            <span>${Number(displayPlan.budget).toFixed(2)}</span>
          </div>
        </div>
        <div className="border-t my-2"></div>
        <div className="flex justify-between text-xl font-bold">
          <span>{newPlan ? "Amount Due Today" : "Total Amount"}</span>
          <span>${Number(totalAmount).toFixed(2)} {originalPlan.currency.toUpperCase()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function PaymentPage() {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [flowerPlan, setFlowerPlan] = useState<FlowerPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCreatedPaymentIntentRef = useRef(false);
  
  // For management flow
  const isManagementFlow = searchParams.get('source') === 'management';
  const [newPlanDetails, setNewPlanDetails] = useState<PartialFlowerPlan & { amount: number } | undefined>(undefined);

  useEffect(() => {
    if (!planId) {
      setError('No Plan ID provided.');
      setIsLoading(false);
      return;
    }

    if (clientSecret || hasCreatedPaymentIntentRef.current) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    hasCreatedPaymentIntentRef.current = true;

    const budget = searchParams.get('budget');
    const deliveries_per_year = searchParams.get('deliveries_per_year');
    const years = searchParams.get('years');
    const amount = searchParams.get('amount');

    getFlowerPlan(planId)
      .then(planData => {
        setFlowerPlan(planData);
        
        let modificationDetails;
        if (isManagementFlow && budget && deliveries_per_year && years && amount) {
            modificationDetails = {
                budget: parseFloat(budget),
                deliveries_per_year: parseInt(deliveries_per_year, 10),
                years: parseInt(years, 10),
                amount: parseFloat(amount)
            };
            setNewPlanDetails(modificationDetails);
        }
        
        // Prepare the payload for creating the payment intent
        const payload: {
            flower_plan_id: string;
            amount?: number;
            budget?: number;
            years?: number;
            deliveries_per_year?: number;
        } = {
            flower_plan_id: planData.id.toString(),
        };

        if (isManagementFlow && modificationDetails) {
            payload.amount = modificationDetails.amount;
            payload.budget = modificationDetails.budget;
            payload.years = modificationDetails.years;
            payload.deliveries_per_year = modificationDetails.deliveries_per_year;
        }

        return createPaymentIntent(payload);
      })
      .then(intentData => {
        setClientSecret(intentData.clientSecret);
        // If the backend sends back the calculated amount, we can use it.
        // For now, we rely on the amount from the URL for the management flow.
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to load plan details or initialize payment.');
        toast.error('An error occurred', {
          description: err.message || 'Please try refreshing the page.',
        });
        hasCreatedPaymentIntentRef.current = false;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [planId, clientSecret, searchParams, isManagementFlow]);

  if (error) {
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
        <div className="text-center mb-4 text-black ">
          <h1 className="text-3xl font-bold">Complete Your Payment</h1>
          <p>Secure your ForeverFlower plan.</p>
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
                              <CheckoutForm 
                                planId={flowerPlan.id.toString()}
                                source={isManagementFlow ? 'management' : undefined}
                              />
                          </Elements>
                      </CardContent>
                  </Card>
              )}
          </div>

          {/* Right Column (Summary) */}
          <div className="order-1 md:order-2 w-full mb-8 md:mb-0">
            {isLoading || !flowerPlan ? (
              <Card className="bg-white shadow-md border-none text-black">
                  <CardHeader>
                      <CardTitle>Loading Plan...</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center h-48">
                      <Spinner className="h-12 w-12" />
                  </CardContent>
              </Card>
            ) : (
              <PlanSummary 
                originalPlan={flowerPlan}
                newPlan={isManagementFlow ? (newPlanDetails ?? undefined) : undefined}
              />
            )}
          </div>
        </div>
        <div className="mt-8">
            <BackButton />
        </div>
      </div>
    </div>
  );
}