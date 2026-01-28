// foreverflower/frontend/src/components/PlanDisplay.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFlowerPlan, getColors, getFlowerTypes } from '@/api';
import type { FlowerPlan, Color, FlowerType } from '@/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanDisplayProps {
    children: (data: {
        plan: UpfrontPlan;
        colorMap: Map<number, Color>;
        flowerTypeMap: Map<number, FlowerType>;
    }) => React.ReactNode;
    fallbackNavigationPath?: string;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({
    children,
    fallbackNavigationPath = '/dashboard'
}) => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();

    const [plan, setPlan] = useState<UpfrontPlan | null>(null);
    const [colors, setColors] = useState<Color[]>([]);
    const [flowerTypes, setFlowerTypes] = useState<FlowerType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const colorMap = useMemo(() => new Map(colors.map(c => [c.id, c])), [colors]);
    const flowerTypeMap = useMemo(() => new Map(flowerTypes.map(ft => [ft.id, ft])), [flowerTypes]);

    useEffect(() => {
        if (!planId) {
            toast.error('No Upfront Plan ID found in URL.');
            navigate(fallbackNavigationPath);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [planData, colorsData, flowerTypesData] = await Promise.all([
                    getUpfrontPlan(planId),
                    getColors(),
                    getFlowerTypes(),
                ]);
                setPlan(planData);
                setColors(colorsData);
                setFlowerTypes(flowerTypesData);
            } catch (err: any) {
                const errorMessage = 'Failed to load upfront plan details.';
                setError(errorMessage);
                toast.error(errorMessage, { description: err.message });
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [planId, navigate, fallbackNavigationPath]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading your upfront plan summary...</p>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-black">
                <h1 className="text-2xl font-bold mb-2">Could Not Load Upfront Plan</h1>
                <p>There was an error loading your upfront plan details. Please try again from your dashboard.</p>
                <Button asChild className="mt-4">
                    <Link to={fallbackNavigationPath}>Go to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return <>{children({ plan, colorMap, flowerTypeMap })}</>;
};

export default PlanDisplay;
