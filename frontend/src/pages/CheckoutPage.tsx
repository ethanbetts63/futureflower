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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [planId, setPlanId] = useState<string | null>(null); // State to store planId
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const secret = location.state?.clientSecret;
        const id = location.state?.planId; // Extract planId from state
        if (secret) {
            setClientSecret(secret);
            if (id) setPlanId(id); // Set planId if available
        } else {
            toast.error("Checkout session is invalid or has expired.", {
                description: "Please try starting the process again.",
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
    
    if (!clientSecret) {
        // Redirect if there's no client secret after checking.
        return <Navigate to="/" replace />;
    }

    const appearance: Appearance = { theme: 'stripe' };
    const options: StripeElementsOptions = { clientSecret, appearance };

    return (
        <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
            <Seo title="Complete Payment | ForeverFlower" />
            <div className="container mx-auto max-w-lg px-4">
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <div className="text-center text-sm pb-2"><p>Powered by <span className="font-bold">Stripe</span></p></div>
                        <CardTitle className="text-2xl text-center">Complete Your Payment</CardTitle>
                        <CardDescription className="text-center">Enter your card information below to finalize your purchase.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm 
                                planId={planId || "N/A"} // Pass actual planId or fallback
                                source="checkout"
                            />
                        </Elements>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CheckoutPage;