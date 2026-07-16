// futureflower/frontend/src/components/PlanDisplay.tsx
"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getFlowerTypes } from '@/api';
import type { FlowerType } from '../types/FlowerType';
import type { Order } from '../types/Order';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { PlanDisplayProps } from '../types/PlanDisplayProps';

function PlanDisplay<T extends Order = Order>({
    children,
    fallbackNavigationPath = '/dashboard',
    getPlan,
}: PlanDisplayProps<T>) {
    const [plan, setPlan] = useState<T | null>(null);
    const [flowerTypes, setFlowerTypes] = useState<FlowerType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const flowerTypeMap = useMemo(() => new Map(flowerTypes.map(ft => [ft.id, ft])), [flowerTypes]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [planData, flowerTypesData] = await Promise.all([
                    getPlan(),
                    getFlowerTypes(),
                ]);
                setPlan(planData);
                setFlowerTypes(flowerTypesData);
            } catch (err: any) {
                const errorMessage = 'Failed to load plan details.';
                setError(errorMessage);
                toast.error(errorMessage, { description: err.message });
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
            const planData = await getPlan();
            setPlan(planData);
        } catch (err) {
            console.error('Failed to refresh plan:', err);
        }
    };

    return <>{children({ plan, flowerTypeMap, refreshPlan })}</>;
};

export default PlanDisplay;
