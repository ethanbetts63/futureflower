// frontend/src/components/EventGate.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Seo from '../Seo';
import { getOrCreatePendingUpfrontPlan } from '@/api/upfrontPlans';
import { getOrCreatePendingSubscriptionPlan } from '@/api/subscriptionPlans';
import { getOrCreatePendingSingleDeliveryTypeUpfrontPlan } from '@/api/singleDeliveryPlans';
import { toast } from 'sonner';

const EventGate: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const { flowType } = useParams<{ flowType?: string }>();
    const hasInitiated = useRef(false);

    const isSubscriptionFlow = flowType === 'subscription';
    const isSingleDeliveryFlow = flowType === 'single-delivery';

    useEffect(() => {
        if (isLoading || hasInitiated.current) {
            return;
        }

        if (isAuthenticated) {
            hasInitiated.current = true;
            const findOrCreatePlan = async () => {
                try {
                    if (isSubscriptionFlow) {
                        const plan = await getOrCreatePendingSubscriptionPlan();
                        navigate(`/subscribe-flow/subscription-plan/${plan.id}/recipient`, { replace: true });
                    } else if (isSingleDeliveryFlow) {
                        const plan = await getOrCreatePendingSingleDeliveryTypeUpfrontPlan();
                        navigate(`/single-delivery-flow/plan/${plan.id}/recipient`, { replace: true });
                    } else {
                        const plan = await getOrCreatePendingUpfrontPlan();
                        navigate(`/upfront-flow/upfront-plan/${plan.id}/recipient`, { replace: true });
                    }
                } catch (error: any) {
                    toast.error("Could not prepare your plan", {
                        description: error.message || "Please try again later.",
                    });
                    navigate('/dashboard', { replace: true });
                }
            };
            findOrCreatePlan();
        } else {
            const nextUrl = flowType ? `?next=/event-gate/${flowType}` : '';
            navigate(`/upfront-flow/create-account${nextUrl}`, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, isSubscriptionFlow, isSingleDeliveryFlow, flowType]);

    // Render a loading indicator while we determine the auth state
    return (
        <div className="container mx-auto flex justify-center items-center h-screen">
            <Seo
                title="Create a New Plan | FutureFlower"
                description="Start here to create a new flower plan. We'll guide you through setting up your plan details and preferences."
                canonicalPath={flowType ? `/event-gate/${flowType}` : "/event-gate"}
                noindex={true}
            />
            <div className="text-center">
                <p className="text-lg font-semibold">Preparing your workspace...</p>
                <p className="text-muted-foreground">Redirecting...</p>
            </div>
        </div>
    );
};

export default EventGate;
