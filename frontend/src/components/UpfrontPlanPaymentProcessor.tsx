// foreverflower/frontend/src/components/FlowerPlanPaymentProcessor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { getUpfrontPlan, createPaymentIntent } from '@/api';
import type { UpfrontPlan, PartialUpfrontPlan, CreatePaymentIntentPayload } from '@/api';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CheckoutForm from '../forms/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PlanSummaryProps {
  originalPlan: UpfrontPlan;
  newPlan?: PartialUpfrontPlan & { amount: number };
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
            {newPlan && newPlan.budget !== originalPlan.budget && <span className="text-gray-500 line-through mr-2">${Number(originalPlan.budget).toFixed(2)}</span>}
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

interface UpfrontPlanPaymentProcessorProps {
    mode: 'booking' | 'management';
}

const UpfrontPlanPaymentProcessor: React.FC<UpfrontPlanPaymentProcessorProps> = ({ mode }) => {
    const { planId } = useParams<{ planId: string }>();
    const [searchParams] = useSearchParams();
    
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [upfrontPlan, setUpfrontPlan] = useState<UpfrontPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasCreatedPaymentIntentRef = useRef(false);
    
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

        getUpfrontPlan(planId)
        .then(upfrontPlanData => {
            setUpfrontPlan(upfrontPlanData);
            
            let modificationDetails;
            if (mode === 'management' && budget && deliveries_per_year && years && amount) {
                modificationDetails = {
                    budget: String(parseFloat(budget)),
                    deliveries_per_year: parseInt(deliveries_per_year, 10),
                    years: parseInt(years, 10),
                    amount: parseFloat(amount)
                };
                setNewPlanDetails(modificationDetails);
            }
            
            const payload: CreatePaymentIntentPayload = {
                upfront_plan_id: upfrontPlanData.id.toString(),
                currency: upfrontPlanData.currency,
            };

            if (mode === 'management' && modificationDetails) {
                payload.amount = modificationDetails.amount;
                payload.budget = Number(modificationDetails.budget);
                payload.years = modificationDetails.years;
                payload.deliveries_per_year = modificationDetails.deliveries_per_year;
            }

            return createPaymentIntent(payload);
        })
        .catch(err => {
            console.error(err);
            setError(err.message || 'Failed to load upfront plan details or initialize payment.');
            toast.error('An error occurred', {
            description: err.message || 'Please try refreshing the page.',
            });
            hasCreatedPaymentIntentRef.current = false;
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [planId, clientSecret, searchParams, mode]);

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
        <div className="flex flex-col md:flex-row md:gap-12">
            {/* Left Column (Payment Form) */}
            <div className="order-2 md:order-1 w-full">
                {isLoading || !clientSecret || !upfrontPlan ? (
                    <Card className="bg-white text-black border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="3xl">Payment Details</CardTitle>
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
                            <CardTitle className="3xl">Payment Details</CardTitle>
                            <CardDescription>Enter your card information below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm 
                                    planId={upfrontPlan.id.toString()}
                                    source={mode === 'management' ? 'management' : undefined}
                                />
                            </Elements>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right Column (Summary) */}
            <div className="order-1 md:order-2 w-full mb-8 md:mb-0">
                {isLoading || !upfrontPlan ? (
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
                    originalPlan={upfrontPlan}
                    newPlan={mode === 'management' ? (newPlanDetails ?? undefined) : undefined}
                />
                )}
            </div>
        </div>
    );
};

export default UpfrontPlanPaymentProcessor;