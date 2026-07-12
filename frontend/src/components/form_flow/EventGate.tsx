// frontend/src/components/EventGate.tsx
"use client";
import { useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Seo from '../Seo';
import { Spinner } from '@/components/ui/spinner';
import { getOrCreateDraftOrder, updateOrder } from '@/api/orders';
import { toast } from 'sonner';
import {
    formatHomepageFlowerNotes,
    HOMEPAGE_BRIEF_STORAGE_KEY,
    type HomepageBrief,
} from '@/lib/homepageBrief';

function readHomepageBrief(): HomepageBrief | null {
    try {
        const rawBrief = window.sessionStorage.getItem(HOMEPAGE_BRIEF_STORAGE_KEY);
        return rawBrief ? JSON.parse(rawBrief) : null;
    } catch {
        return null;
    }
}

async function applyHomepageBrief(planId: number) {
    const brief = readHomepageBrief();

    if (!brief) {
        return;
    }

    try {
        await updateOrder(String(planId), {
            budget: brief.budget,
            preferred_flower_types: brief.vibeId ? [brief.vibeId] : [],
            flower_notes: formatHomepageFlowerNotes(brief),
            ...(brief.startDate ? { start_date: brief.startDate } : {}),
            ...(brief.cardMessage !== undefined
                ? { draft_card_messages: { '0': brief.cardMessage } }
                : {}),
        });

        window.sessionStorage.removeItem(HOMEPAGE_BRIEF_STORAGE_KEY);
    } catch {
        toast.error("We could not save your florist brief yet", {
            description: "You can add those preferences again before checkout.",
        });
    }
}

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
                    if (isSubscriptionFlow || isSingleDeliveryFlow) {
                        const plan = await getOrCreateDraftOrder();
                        await applyHomepageBrief(plan.id);
                        router.replace(`/single-delivery-flow/plan/${plan.id}/recipient`);
                    } else {
                        router.replace('/');
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
        <div className="flex h-screen items-center justify-center bg-white">
            <Seo
                title="Starting Your Order | FutureFlower"
                description="We're setting up your order."
                canonicalPath={flowType ? `/event-gate/${flowType}` : "/event-gate"}
                noindex={true}
            />
            <Spinner className="h-10 w-10 text-black" />
        </div>
    );
};

export default EventGate;
