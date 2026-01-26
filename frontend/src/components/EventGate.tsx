// frontend/src/components/EventGate.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Seo from '../components/Seo';

const EventGate: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Don't do anything until the auth status is definitively known
        if (isLoading) {
            return;
        }

        if (isAuthenticated) {
            // Authenticated users are sent to the first step of the plan creation flow
            navigate('/book-flow/flower-plan/step-1', { replace: true });
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