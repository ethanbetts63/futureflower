// foreverflower/frontend/src/pages/subscription_flow/Step6PaymentPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import Seo from '@/components/Seo';
import PaymentProcessor from '@/components/PaymentProcessor';
import { getSubscriptionPlan, createSubscription } from '@/api';
import SubscriptionPlanSummary from '@/components/SubscriptionPlanSummary';

const Step6PaymentPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto px-4">
                <Seo title="Secure Subscription | ForeverFlower" />
                <div className="text-center mb-8 text-black">
                    <h1 className="text-3xl font-bold">Complete Your Subscription</h1>
                    <p>Secure your recurring flower plan.</p>
                </div>

                <PaymentProcessor 
                    getPlan={getSubscriptionPlan}
                    createPayment={createSubscription}
                    SummaryComponent={SubscriptionPlanSummary}
                    planType="subscription"
                    mode="booking"
                />

                <div className="mt-8">
                    <BackButton to={`/subscribe-flow/subscription-plan/${planId}/confirmation`} />
                </div>
            </div>
        </div>
    );
};

export default Step6PaymentPage;
