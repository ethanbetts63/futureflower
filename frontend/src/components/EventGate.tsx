// frontend/src/pages/EventGate.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Seo from '../components/Seo';
import { getLatestInactiveFlowerPlan } from '@/api';
import { toast } from 'sonner';

/**
 * This component acts as a gatekeeper for the event creation flow.
 * It checks the user's authentication status and redirects them to the
 * appropriate starting point.
 * - Authenticated users are sent to continue their latest inactive plan or create a new one.
 * - Anonymous users are sent to the beginning of the multi-step profile creation flow.
 */
const EventGate: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Don't do anything until the auth status is definitively known
        if (isLoading) {
            return;
        }

        if (isAuthenticated) {
            const checkAndRedirect = async () => {
                try {
                    const inactivePlan = await getLatestInactiveFlowerPlan();
                    if (inactivePlan) {
                        toast.info("Continuing your previously saved plan.");
                        navigate(`/book-flow/create-flower-plan?planId=${inactivePlan.id}`, { replace: true });
                    } else {
                        navigate('/book-flow/create-flower-plan', { replace: true });
                    }
                } catch (error: any) {
                    console.error("Failed to check for inactive plan:", error);
                    toast.error("Could not check for a saved plan.", { description: "Proceeding with a new plan." });
                    navigate('/book-flow/create-flower-plan', { replace: true });
                }
            };
            checkAndRedirect();
        } else {
            // Anonymous users are sent to the account creation page
            navigate('/book-flow/create-account', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Render a loading indicator while we determine the auth state
    return (
        <div className="container mx-auto flex justify-center items-center h-screen">
            <Seo
                title="Create a Long-Term Reminder Event | ForeverFlower"
                description="Start here to create a new persistent, long-term reminder. We'll guide you through setting up your event and notification preferences."
                canonicalPath="/event-gate"
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