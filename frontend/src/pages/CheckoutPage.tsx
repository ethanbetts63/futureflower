// futureflower/frontend/src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import CheckoutForm from '@/forms/CheckoutForm';
import FlowBackButton from '@/components/form_flow/FlowBackButton';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import UnifiedSummaryCard from '@/components/form_flow/UnifiedSummaryCard';
import SummarySection from '@/components/form_flow/SummarySection';
import ImpactSummary from '@/components/form_flow/ImpactSummary';
import { MapPin, Calendar, Clock, RefreshCw, DollarSign, ShieldCheck } from 'lucide-react';
import { getSubscriptionPlan } from '@/api/subscriptionPlans';
import { getUpfrontPlan } from '@/api/upfrontPlans';
import { getUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';
import type { UpfrontPlan, Plan } from '@/types';
import { formatDate } from '@/utils/utils';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [planId, setPlanId] = useState<string | null>(null);
    const [itemType, setItemType] = useState<string | null>(null);
    const [intentType, setIntentType] = useState<'payment' | 'setup' | null>(null); 
    const [backPath, setBackPath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [plan, setPlan] = useState<Plan | null>(null);

    useEffect(() => {
        const secret = location.state?.clientSecret;
        const id = location.state?.planId;
        const type = location.state?.itemType;
        const intent = location.state?.intentType as 'payment' | 'setup'; 
        const back = location.state?.backPath;

        if (secret && id && type && intent) {
            setClientSecret(secret);
            setPlanId(id);
            setItemType(type);
            setIntentType(intent);
            setBackPath(back);

            // Fetch plan details for the summary
            const fetchPlan = async () => {
                try {
                    let fetchedPlan: Plan;
                    if (type === 'SUBSCRIPTION_PLAN_NEW') {
                        fetchedPlan = await getSubscriptionPlan(id);
                    } else if (type === 'UPFRONT_PLAN_NEW') {
                        fetchedPlan = await getUpfrontPlan(id);
                    } else if (type === 'SINGLE_DELIVERY_PLAN_NEW') {
                        fetchedPlan = await getUpfrontPlanAsSingleDelivery(id); 
                    } else {
                        throw new Error(`Invalid itemType: ${type}`);
                    }
                    setPlan(fetchedPlan);
                } catch (err) {
                    console.error('Could not load plan summary:', err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPlan();
        } else {
            setIsLoading(false);
        }
    }, [location.state]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen" style={{ backgroundColor: 'var(--color4)' }}>
                <Spinner className="h-12 w-12" />
            </div>
        );
    }
    
    if (!clientSecret || !planId || !itemType || !intentType || !plan) {
        if (!isLoading) {
            toast.error("Checkout session is invalid or has expired.");
            return <Navigate to="/" replace />;
        }
        return null;
    }

    const appearance: Appearance = { theme: 'stripe' };
    const options: StripeElementsOptions = { clientSecret, appearance };

    const planIsSubscription = 'stripe_subscription_id' in plan || !('years' in plan);
    const upfrontPlan = plan as UpfrontPlan;
    
    const fullAddress = [
        plan.recipient_street_address,
        plan.recipient_suburb,
        plan.recipient_city,
        plan.recipient_state,
        plan.recipient_postcode,
        plan.recipient_country
    ].filter(Boolean).join(', ');

    const totalPlanAmount = Number(plan.total_amount);
    const flowerBudget = Number(plan.budget);
    
    const deliveriesPerYear = {
        'weekly': 52,
        'fortnightly': 26,
        'monthly': 12,
        'quarterly': 4,
        'bi-annually': 2,
        'annually': 1,
    }[plan.frequency?.toLowerCase() || 'annually'] || 1;

    const totalDeliveries = !planIsSubscription ? (upfrontPlan.years * deliveriesPerYear) : 1;
    const totalFlowerValue = flowerBudget * totalDeliveries;
    const totalServiceFee = totalPlanAmount - totalFlowerValue;

    const planName = planIsSubscription ? "Flower Subscription" : (upfrontPlan.years === 1 && upfrontPlan.frequency === 'annually' ? "Single Delivery" : "Upfront Plan");

    return (
        <>
            <Seo title="Complete Your Order | FutureFlower" />
            <StepProgressBar 
                planName={planName} 
                currentStep={planIsSubscription || (upfrontPlan.years === 1 && upfrontPlan.frequency === 'annually') ? 4 : 5} 
                totalSteps={planIsSubscription || (upfrontPlan.years === 1 && upfrontPlan.frequency === 'annually') ? 4 : 5} 
                isReview={true}
                customLabel="Payment"
            />
            
            <div className="min-h-screen w-full py-0 md:py-12" style={{ backgroundColor: 'var(--color4)' }}>
                <div className="container mx-auto px-0 md:px-4 max-w-4xl">
                    <UnifiedSummaryCard
                        title="Complete Your Payment"
                        description="Review your order summary and provide your payment details below to finish."
                        footer={
                            <div className="flex flex-row items-center w-full gap-4">
                                {backPath && <FlowBackButton to={backPath} />}
                                <div className="flex-1 text-right text-xs text-black/40 flex items-center justify-end gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Secure Stripe Checkout
                                </div>
                            </div>
                        }
                    >
                        {/* Recipient Summary */}
                        <SummarySection label="Recipient">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-black/20 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-lg font-['Playfair_Display',_serif]">
                                        {plan.recipient_first_name} {plan.recipient_last_name}
                                    </p>
                                    <p className="text-black/60">{fullAddress || 'No address provided'}</p>
                                </div>
                            </div>
                        </SummarySection>

                        {/* Schedule Summary */}
                        <SummarySection label="Schedule">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    {planIsSubscription ? <RefreshCw className="h-5 w-5 text-black/20 flex-shrink-0" /> : <Clock className="h-5 w-5 text-black/20 flex-shrink-0" />}
                                    <span className="font-bold font-['Playfair_Display',_serif] text-lg capitalize">
                                        {planIsSubscription ? `Every ${plan.frequency}` : `${plan.frequency} Plan — ${upfrontPlan.years} ${upfrontPlan.years === 1 ? 'Year' : 'Years'}`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-black/20 flex-shrink-0" />
                                    <span className="text-black/60">
                                        {planIsSubscription ? (
                                            `First delivery on ${plan.start_date ? formatDate(plan.start_date) : 'Not set'}`
                                        ) : (
                                            `Scheduled for ${formatDate(plan.start_date)}`
                                        )}
                                    </span>
                                </div>
                            </div>
                        </SummarySection>

                        {/* Impact / Budget */}
                        <ImpactSummary price={flowerBudget} />

                        {/* Price Breakdown */}
                        <SummarySection label="Price Breakdown">
                            <div className="space-y-3 bg-black/5 rounded-2xl p-6 mt-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-black/60">Flower Value {!planIsSubscription && `(x${totalDeliveries} deliveries)`}</span>
                                    <span className="font-semibold">${totalFlowerValue.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-black/60">Service & Refund Protection</span>
                                    <span className="font-semibold">${totalServiceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-black/60">Delivery</span>
                                    <span className="font-semibold">$0.00</span>
                                </div>
                                <div className="pt-3 border-t border-black/10 flex items-center justify-between">
                                    <span className="font-bold text-black flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-black/40" />
                                        {planIsSubscription ? 'Total Per Delivery' : 'Total Amount Due'}
                                    </span>
                                    <span className="text-xl font-bold text-black">${totalPlanAmount.toFixed(2)}</span>
                                </div>
                                {planIsSubscription && (
                                    <p className="text-[10px] text-black/40 text-center uppercase tracking-widest mt-2">
                                        Charged recurringly at the frequency selected above.
                                    </p>
                                )}
                            </div>
                        </SummarySection>

                        {/* Payment Section */}
                        <SummarySection label="Payment Method">
                            <div className="mt-2">
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm 
                                        planId={planId}
                                        source="checkout"
                                        intentType={intentType}
                                        itemType={itemType}
                                    />
                                </Elements>
                            </div>
                        </SummarySection>
                    </UnifiedSummaryCard>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;