// foreverflower/frontend/src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Seo from '@/components/Seo';
import CheckoutForm from '@/forms/CheckoutForm';
import OrderSummaryCard from '@/components/OrderSummaryCard'; 

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [planId, setPlanId] = useState<string | null>(null);
    const [itemType, setItemType] = useState<string | null>(null);
    const [intentType, setIntentType] = useState<'payment' | 'setup' | null>(null); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const secret = location.state?.clientSecret;
        const id = location.state?.planId;
        const type = location.state?.itemType;
        const intent = location.state?.intentType as 'payment' | 'setup'; 

        if (secret && id && type && intent) {
            setClientSecret(secret);
            setPlanId(id);
            setItemType(type);
            setIntentType(intent);
        } else {
            toast.error("Checkout session is invalid or has expired.", {
                description: "Missing required information. Please try again.",
            });
        }
        setIsLoading(false);
    }, [location.state]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }
    
    if (!clientSecret || !planId || !itemType || !intentType) {
        // Redirect if there's no client secret or other required info after checking.
        return <Navigate to="/" replace />;
    }

    const appearance: Appearance = { theme: 'stripe' };
    const options: StripeElementsOptions = { clientSecret, appearance };

    return (
        <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
            <Seo title="Complete Payment | ForeverFlower" />
            <div className="container mx-auto max-w-5xl px-4">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* Left Column: Payment Form */}
                    <div className="w-full md:w-3/5">
                        <Card className="bg-white text-black border-none shadow-md">
                            <CardHeader>
                                <div className="text-center text-sm pb-2"><p>Powered by <span className="font-bold">Stripe</span></p></div>
                                <CardTitle className="text-2xl text-center">Complete Your Payment</CardTitle>
                                <CardDescription className="text-center">Enter your card information below to finalize your purchase.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm 
                                        planId={planId}
                                        source="checkout"
                                        intentType={intentType}
                                    />
                                </Elements>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full md:w-2/5">
                        <OrderSummaryCard planId={planId} itemType={itemType} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;