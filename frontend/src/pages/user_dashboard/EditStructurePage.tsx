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
import { authedFetch } from '@/apiClient';
import PlanStructureForm, { type PlanStructureData } from '@/forms/PlanStructureForm';
import BackButton from '@/components/BackButton';
import { debounce } from '@/utils/debounce';

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
    const [amountOwing, setAmountOwing] = useState<number | null>(null);
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

    const calculateModification = useCallback((budget: number, deliveries: number, years: number) => {
        if (!planId) return;
        setIsDebouncePending(false);
        setIsApiCalculating(true);
        setError(null);
        setAmountOwing(null);

        authedFetch(`/api/events/flower-plans/${planId}/calculate-modification/`, {
            method: 'POST',
            body: JSON.stringify({ budget, deliveries_per_year: deliveries, years }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.detail || "Server error");
                });
            }
            return response.json();
        })
        .then((data: { amount_owing: number }) => {
            setAmountOwing(data.amount_owing);
        })
        .catch(err => {
            setError(err.message);
            toast.error("Calculation Error", { description: err.message });
        })
        .finally(() => {
            setIsApiCalculating(false);
        });
    }, [planId]);

    const debouncedCalculateModification = useMemo(() => debounce(calculateModification, 500), [calculateModification]);

    useEffect(() => {
        if (!isLoading && !isSaving) {
            debouncedCalculateModification(formData.budget, formData.deliveries_per_year, formData.years);
        }
        return () => { debouncedCalculateModification.cancel?.(); };
    }, [formData, isLoading, isSaving, debouncedCalculateModification]);


    const handleFormChange = (field: keyof PlanStructureData, value: number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!planId) return;

        // If there's an amount to be paid, navigate to the payment page with modification details.
        if (amountOwing && amountOwing > 0) {
            const params = new URLSearchParams({
                source: 'management',
                budget: formData.budget.toString(),
                deliveries_per_year: formData.deliveries_per_year.toString(),
                years: formData.years.toString(),
                amount: amountOwing.toString(),
            });
            navigate(`/book-flow/flower-plan/${planId}/payment?${params.toString()}`);
            return;
        }

        // If no amount is owing (or it's a credit), just update the plan and redirect.
        setIsSaving(true);
        try {
            const payload: PartialFlowerPlan = { ...formData };
            await updateFlowerPlan(planId, payload);
            toast.success("Plan updated successfully!");
            navigate(`/dashboard/plans/${planId}/overview`);
        } catch (err: any) {
            toast.error("Failed to update plan structure.", { description: err.message });
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
                                amountOwing !== null && (
                                <>
                                    <div className="text-2xl font-bold">${amountOwing.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <p className="text-xs text-gray-600">Amount to pay for this change</p>
                                </>
                                )
                            )}
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <BackButton to={`/dashboard/plans/${planId}/overview`} />
                        <Button size="lg" onClick={handleSave} disabled={isSaving || isApiCalculating || isDebouncePending || amountOwing === null}>
                            {isSaving 
                                ? <Spinner className="mr-2 h-4 w-4" /> 
                                : (amountOwing && amountOwing > 0 ? 'Proceed to Payment' : 'Save Changes')
                            }
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default EditStructurePage;
