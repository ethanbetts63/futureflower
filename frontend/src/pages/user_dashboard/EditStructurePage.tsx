// C:\Users\ethan\coding\foreverflower\frontend\src\pages\user_dashboard\EditStructurePage.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { getFlowerPlan, updateFlowerPlan, type PartialFlowerPlan } from '@/api';
import PlanStructureForm, { type PlanStructureData } from '@/components/PlanStructureForm';
import BackButton from '@/components/BackButton';
import { debounce } from '@/utils/debounce';

type Breakdown = {
  fee_per_delivery: number;
  years: number;
  deliveries_per_year: number;
  upfront_savings_percentage: number;
};

const EditStructurePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<PlanStructureData>({
        budget: 75,
        deliveries_per_year: 1,
        years: 5,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Price calculation state
    const [upfrontPrice, setUpfrontPrice] = useState<number | null>(null);
    const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
    const [isApiCalculating, setIsApiCalculating] = useState(false);
    const [isDebouncePending, setIsDebouncePending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to edit a plan.");
            navigate('/login');
            return;
        }
        if (!planId) {
            toast.error("No flower plan specified.");
            navigate('/dashboard');
            return;
        }

        const fetchPlanData = async () => {
            setIsLoading(true);
            try {
                const plan = await getFlowerPlan(planId);
                setFormData({
                    budget: plan.budget,
                    deliveries_per_year: plan.deliveries_per_year,
                    years: plan.years,
                });
            } catch (err) {
                toast.error("Failed to load plan data.");
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlanData();
    }, [planId, isAuthenticated, navigate]);

    const calculateUpfront = useCallback(async (budget: number, deliveries: number, years: number) => {
        setIsDebouncePending(false);
        setIsApiCalculating(true);
        setError(null);
        setUpfrontPrice(null);
        setBreakdown(null);

        try {
            const response = await fetch('/api/events/calculate-price/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ budget, deliveries_per_year: deliveries, years }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong');
            setUpfrontPrice(data.upfront_price);
            setBreakdown(data.breakdown);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsApiCalculating(false);
        }
    }, []);

    const debouncedCalculateUpfront = useMemo(() => debounce(calculateUpfront, 500), [calculateUpfront]);

    useEffect(() => {
        if (!isLoading && !isSaving) {
            debouncedCalculateUpfront(formData.budget, formData.deliveries_per_year, formData.years);
        }
        return () => { debouncedCalculateUpfront.cancel?.(); };
    }, [formData, isLoading, isSaving, debouncedCalculateUpfront]);


    const handleFormChange = (field: keyof PlanStructureData, value: number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId) return;
        setIsSaving(true);
        try {
            const payload: PartialFlowerPlan = { ...formData };
            await updateFlowerPlan(planId, payload);
            toast.success("Plan structure updated successfully!");
            navigate(`/dashboard/plans/${planId}/overview`);
        } catch (err) {
            toast.error("Failed to update plan structure.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
    }

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title="Edit Plan Structure | ForeverFlower" />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">Edit Plan Structure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <PlanStructureForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            setIsDebouncePending={setIsDebouncePending}
                            title=""
                        />
                         {/* Calculation Result */}
                        <div className="mt-8 text-center h-12 flex flex-col items-center justify-center">
                            {(isApiCalculating || isDebouncePending) ? (
                                <Spinner className="h-8 w-8" />
                            ) : (
                                upfrontPrice !== null && (
                                <>
                                    <div className="text-2xl font-bold">${upfrontPrice.toLocaleString()}</div>
                                    {breakdown?.upfront_savings_percentage && <p className="text-xs text-gray-600">A new charge will be calculated and applied to your account</p>}
                                </>
                                )
                            )}
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <BackButton to={`/dashboard/plans/${planId}/overview`} />
                        <Button size="lg" onClick={handleSave} disabled={isSaving || isApiCalculating || isDebouncePending || !upfrontPrice}>
                            {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default EditStructurePage;
