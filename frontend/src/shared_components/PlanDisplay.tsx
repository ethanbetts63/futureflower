// futureflower/frontend/src/components/PlanDisplay.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Order } from '@/types/Order';
import { toast } from 'sonner';
import { Button } from '@/shared_components/ui/button';
import type { PlanDisplayProps } from '@/types/PlanDisplayProps';
import { errorMessage } from '@/utils/errors';

function PlanDisplay<T extends Order = Order>({
    children,
    fallbackNavigationPath = '/dashboard',
    getPlan,
}: PlanDisplayProps<T>) {
    const [plan, setPlan] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                setPlan(await getPlan());
            } catch (err) {
                const summary = 'Failed to load plan details.';
                setError(summary);
                toast.error(summary, { description: errorMessage(err) });
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getPlan]);

    // The plan fetch is a single quick GET; a flash of spinner looks worse
    // than a moment of empty page background.
    if (loading) {
        return null;
    }

    if (error || !plan) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-black">
                <h1 className="text-2xl font-bold mb-2">Could Not Load Plan</h1>
                <p>There was an error loading your plan details. Please try again from your dashboard.</p>
                <Button asChild className="mt-4">
                    <Link href={fallbackNavigationPath}>Go to Dashboard</Link>
                </Button>
            </div>
        );
    }

    const refreshPlan = async () => {
        try {
            setPlan(await getPlan());
        } catch (err) {
            console.error('Failed to refresh plan:', err);
        }
    };

    return <>{children({ plan, refreshPlan })}</>;
};

export default PlanDisplay;
