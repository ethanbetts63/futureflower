import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { createFlowerPlan, getFlowerPlan, deleteFlowerPlan, type CreateFlowerPlanPayload } from '@/api';
import { debounce } from '@/utils/debounce';
import RecipientForm, { type RecipientData } from '@/forms/RecipientForm';
import PlanStructureForm, { type PlanStructureData } from '@/forms/PlanStructureForm';

type Breakdown = {
  fee_per_delivery: number;
  years: number;
  deliveries_per_year: number;
  upfront_savings_percentage: number;
};

const FlowerPlanCreationPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const planId = searchParams.get('planId');
    const isUpdateMode = !!planId;

    // --- State Management ---
    const [recipientData, setRecipientData] = useState<RecipientData>({
        recipient_first_name: '',
        recipient_last_name: '',
        recipient_street_address: '',
        recipient_suburb: '',
        recipient_city: '',
        recipient_state: '',
        recipient_postcode: '',
        recipient_country: '',
    });

    const [planStructureData, setPlanStructureData] = useState<PlanStructureData>({
        budget: 75,
        deliveries_per_year: 1,
        years: 5,
    });

    // API & UI State
    const [upfrontPrice, setUpfrontPrice] = useState<number | null>(null);
    const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
    const [isApiCalculating, setIsApiCalculating] = useState(false);
    const [isDebouncePending, setIsDebouncePending] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(isUpdateMode);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to create a flower plan.");
            navigate('/login');
            return;
        }

        if (isUpdateMode && planId) {
            const fetchPlan = async () => {
                setIsInitialLoading(true);
                try {
                    const existingPlan = await getFlowerPlan(planId);
                    setRecipientData({
                        recipient_first_name: existingPlan.recipient_first_name || '',
                        recipient_last_name: existingPlan.recipient_last_name || '',
                        recipient_street_address: existingPlan.recipient_street_address || '',
                        recipient_suburb: existingPlan.recipient_suburb || '',
                        recipient_city: existingPlan.recipient_city || '',
                        recipient_state: existingPlan.recipient_state || '',
                        recipient_postcode: existingPlan.recipient_postcode || '',
                        recipient_country: existingPlan.recipient_country || '',
                    });
                    setPlanStructureData({
                        budget: existingPlan.budget,
                        deliveries_per_year: existingPlan.deliveries_per_year,
                        years: existingPlan.years,
                    });
                } catch (err: any) {
                    toast.error("Failed to load your saved plan.", { description: "Starting a new plan instead." });
                    navigate('/book-flow/create-flower-plan', { replace: true });
                } finally {
                    setIsInitialLoading(false);
                }
            };
            fetchPlan();
        }
    }, [isAuthenticated, navigate, isUpdateMode, planId]);

    const calculateUpfront = useCallback(async (currentBudget: number, currentDeliveries: number, currentYears: number) => {
        setIsDebouncePending(false);
        setIsApiCalculating(true);
        setError(null);
        setUpfrontPrice(null);
        setBreakdown(null);

        try {
            const response = await fetch('/api/events/calculate-price/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ budget: currentBudget, deliveries_per_year: currentDeliveries, years: currentYears }),
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
        if (isAuthenticated && !isSubmitting && !isInitialLoading) {
            debouncedCalculateUpfront(planStructureData.budget, planStructureData.deliveries_per_year, planStructureData.years);
        }
        return () => { debouncedCalculateUpfront.cancel?.(); };
    }, [planStructureData, isAuthenticated, isSubmitting, isInitialLoading, debouncedCalculateUpfront]);

    const handleRecipientFormChange = (field: keyof RecipientData, value: string) => {
        setRecipientData(prev => ({ ...prev, [field]: value }));
    };

    const handlePlanStructureFormChange = (field: keyof PlanStructureData, value: number) => {
        setPlanStructureData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSubmit = async () => {
        if (!upfrontPrice) {
            toast.error("Please wait for the price to be calculated.");
            return;
        }
        setIsSubmitting(true);
        setError(null);

        try {
            if (isUpdateMode && planId) {
                await deleteFlowerPlan(planId);
            }

            const payload: CreateFlowerPlanPayload = {
                ...recipientData,
                ...planStructureData,
            };

            const newPlan = await createFlowerPlan(payload);

            navigate(`/book-flow/flower-plan/${newPlan.id}/preferences`);
        } catch (err: any) {
            setError(err.message);
            toast.error(isUpdateMode ? "Failed to update plan." : "Failed to create plan.", { description: err.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isAuthenticated || isInitialLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-12 w-12" />
                <p className="ml-4 text-muted-foreground">{isInitialLoading ? "Loading your saved plan..." : "Redirecting..."}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title={isUpdateMode ? "Update Your Plan" : "Create Plan"} />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">{isUpdateMode ? "Continue Your Flower Plan" : "Create Your Flower Plan"}</CardTitle>
                        <CardDescription className="text-black">
                            {isUpdateMode ? "Adjust the details of your saved plan below." : "Design your perfect long-term flower plan. Pay upfront and save!"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <RecipientForm formData={recipientData} onFormChange={handleRecipientFormChange} />
                        <Separator />
                        <PlanStructureForm formData={planStructureData} onFormChange={handlePlanStructureFormChange} setIsDebouncePending={setIsDebouncePending}/>
                        
                        {/* Calculation Result */}
                        <div className="mt-8 text-center h-12 flex flex-col items-center justify-center">
                            {(isApiCalculating || isDebouncePending) ? (
                                <Spinner className="h-8 w-8" />
                            ) : (
                                upfrontPrice !== null && (
                                <>
                                    <div className="text-2xl font-bold">${upfrontPrice.toLocaleString()}</div>
                                    {breakdown?.upfront_savings_percentage && <p className="text-xs text-gray-600">That's a ~{breakdown.upfront_savings_percentage}% savings compared to paying per delivery!</p>}
                                </>
                                )
                            )}
                            {error && !isSubmitting && <div className="text-red-500 text-sm">{error}</div>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button 
                            size="lg"
                            disabled={!upfrontPrice || isApiCalculating || isDebouncePending || isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : (isUpdateMode ? 'Next' : 'Next: Select Preferences')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
export default FlowerPlanCreationPage;
