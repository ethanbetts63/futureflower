// foreverflower/frontend/src/components/PaymentProcessor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import type { UpfrontPlan, SubscriptionPlan, PartialUpfrontPlan } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CheckoutForm from '../forms/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

type Plan = UpfrontPlan | SubscriptionPlan;

interface PaymentProcessorProps {
    getPlan: (planId: string) => Promise<Plan>;
    createPayment: (payload: any) => Promise<{ clientSecret: string }>;
    SummaryComponent: React.FC<{ plan: Plan; newPlanDetails?: any }>;
    planType: 'upfront' | 'subscription';
    mode: 'booking' | 'management';
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
    getPlan,
    createPayment,
    SummaryComponent,
    planType,
    mode,
}) => {
    const { planId } = useParams<{ planId: string }>();
    const [searchParams] = useSearchParams();
    
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasInitiatedPaymentRef = useRef(false);
    
    // Using 'any' for newPlanDetails because it's transient and depends on URL params
    const [newPlanDetails, setNewPlanDetails] = useState<any | undefined>(undefined);

    useEffect(() => {
        if (!planId) {
            setError('No Plan ID provided.');
            setIsLoading(false);
            return;
        }

        if (clientSecret || hasInitiatedPaymentRef.current) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        hasInitiatedPaymentRef.current = true;

        getPlan(planId)
        .then(planData => {
            setPlan(planData);
            
            let modificationDetails;
            let payload: any;

            if (planType === 'upfront') {
                const budget = searchParams.get('budget');
                const deliveries_per_year = searchParams.get('deliveries_per_year');
                const years = searchParams.get('years');
                const amount = searchParams.get('amount');

                if (mode === 'management' && budget && deliveries_per_year && years && amount) {
                    modificationDetails = {
                        budget: String(parseFloat(budget)),
                        deliveries_per_year: parseInt(deliveries_per_year, 10),
                        years: parseInt(years, 10),
                        amount: parseFloat(amount)
                    };
                    setNewPlanDetails(modificationDetails);
                }
                
                payload = { upfront_plan_id: planData.id.toString() };
                if (mode === 'management' && modificationDetails) {
                    payload.amount = modificationDetails.amount;
                    payload.budget = Number(modificationDetails.budget);
                    payload.years = modificationDetails.years;
                    payload.deliveries_per_year = modificationDetails.deliveries_per_year;
                }
            } else if (planType === 'subscription') {
                payload = { subscription_plan_id: planData.id.toString() };
            }

            return createPayment(payload);
        })
        .then(data => {
            setClientSecret(data.clientSecret);
        })
        .catch(err => {
            console.error(err);
            setError(err.message || 'Failed to load plan details or initialize payment.');
            toast.error('An error occurred', {
                description: err.message || 'Please try refreshing the page.',
            });
            hasInitiatedPaymentRef.current = false;
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [planId, clientSecret, searchParams, mode, getPlan, createPayment, planType]);

    if (error) {
        toast.error("Invalid payment state", { description: error });
        return <Navigate to="/dashboard" replace />;
    }

    const appearance: Appearance = { theme: 'stripe' };
    const options: StripeElementsOptions = { clientSecret: clientSecret || undefined, appearance };

    return (
        <div className="flex flex-col md:flex-row md:gap-12">
            <div className="order-2 md:order-1 w-full">
                {isLoading || !clientSecret || !plan ? (
                    <Card className="bg-white text-black border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
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
                            <div className="text-center text-sm pb-2"><p>Powered by <span className="font-bold">Stripe</span></p></div>
                            <CardTitle>Payment Details</CardTitle>
                            <CardDescription>Enter your card information below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm 
                                    planId={plan.id.toString()}
                                    source={`${planType}-${mode}`}
                                />
                            </Elements>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="order-1 md:order-2 w-full mb-8 md:mb-0">
                {isLoading || !plan ? (
                <Card className="bg-white shadow-md border-none text-black">
                    <CardHeader><CardTitle>Loading Plan...</CardTitle></CardHeader>
                    <CardContent className="flex justify-center items-center h-48"><Spinner className="h-12 w-12" /></CardContent>
                </Card>
                ) : (
                    <SummaryComponent plan={plan} newPlanDetails={newPlanDetails} />
                )}
            </div>
        </div>
    );
};

export default PaymentProcessor;