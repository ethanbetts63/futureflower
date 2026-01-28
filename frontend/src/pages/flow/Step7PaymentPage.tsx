// foreverflower/frontend/src/pages/flow/Step7PaymentPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import Seo from '@/components/Seo';
import FlowerPlanPaymentProcessor from '@/components/FlowerPlanPaymentProcessor';

const Step7PaymentPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto px-4">
                <Seo title="Secure Payment | ForeverFlower" />
                <div className="text-center mb-8 text-black">
                    <h1 className="text-3xl font-bold">Complete Your Payment</h1>
                    <p>Secure your ForeverFlower plan.</p>
                </div>

                <FlowerPlanPaymentProcessor mode="booking" />

                <div className="mt-8">
                    <BackButton to={`/book-flow/flower-plan/${planId}/confirmation`} />
                </div>
            </div>
        </div>
    );
};

export default Step7PaymentPage;
