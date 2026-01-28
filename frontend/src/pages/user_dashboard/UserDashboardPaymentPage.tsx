// foreverflower/frontend/src/pages/user_dashboard/UserDashboardPaymentPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import Seo from '@/components/Seo';
import UpfrontPlanPaymentProcessor from '@/components/UpfrontPlanPaymentProcessor';

const UserDashboardPaymentPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <div className="min-h-screen w-full py-8" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto px-4">
                <Seo title="Complete Payment | ForeverFlower" />
                <div className="text-center mb-8 text-black">
                    <h1 className="text-3xl font-bold">Complete Your Payment</h1>
                    <p>Finalize the changes to your ForeverFlower plan.</p>
                </div>

                <UpfrontPlanPaymentProcessor mode="management" />

                <div className="mt-8">
                    <BackButton to={`/dashboard/plans/${planId}/edit-structure`} />
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPaymentPage;
