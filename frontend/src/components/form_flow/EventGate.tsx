// frontend/src/components/EventGate.tsx
"use client";
import { useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Seo from '../Seo';
import { getOrCreatePendingSubscriptionPlan } from '@/api/subscriptionPlans';
import { getOrCreatePendingSingleDeliveryTypeUpfrontPlan } from '@/api/singleDeliveryPlans';
import { toast } from 'sonner';

const EventGate = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const flowType = params.flowType ? (Array.isArray(params.flowType) ? params.flowType[0] : params.flowType) : undefined;
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
                        router.replace(`/subscribe-flow/subscription-plan/${plan.id}/recipient`);
                    } else if (isSingleDeliveryFlow) {
                        const plan = await getOrCreatePendingSingleDeliveryTypeUpfrontPlan();
                        router.replace(`/single-delivery-flow/plan/${plan.id}/recipient`);
                    } else {
                        router.replace('/order');
                    }
                } catch (error: any) {
                    toast.error("Could not prepare your plan", {
                        description: error.message || "Please try again later.",
                    });
                    router.replace('/dashboard');
                }
            };
            findOrCreatePlan();
        } else {
            const nextUrl = flowType ? `?next=/event-gate/${flowType}` : '';
            router.replace(`/create-account${nextUrl}`);
        }
    }, [isAuthenticated, isLoading, router, isSubscriptionFlow, isSingleDeliveryFlow, flowType]);

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
