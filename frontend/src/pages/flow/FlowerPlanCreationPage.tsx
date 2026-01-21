import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { createFlowerPlan, getFlowerPlan, deleteFlowerPlan } from '@/api';
import { debounce } from '@/utils/debounce';

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

    // State for the form
    const [bouquetBudget, setBouquetBudget] = useState(75);
    const [deliveriesPerYear, setDeliveriesPerYear] = useState(1);
    const [years, setYears] = useState(5);

    // API/Calculation result state
    const [upfrontPrice, setUpfrontPrice] = useState<number | null>(null);
    const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
    const [isApiCalculating, setIsApiCalculating] = useState(false);
    const [isDebouncePending, setIsDebouncePending] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Combined create/update state
    const [isInitialLoading, setIsInitialLoading] = useState(isUpdateMode); // Only true if we are fetching an existing plan
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to create a flower plan.");
            navigate('/login');
            return; // Early exit
        }

        if (isUpdateMode && planId) {
            const fetchPlan = async () => {
                setIsInitialLoading(true);
                try {
                    const existingPlan = await getFlowerPlan(planId);
                    setBouquetBudget(existingPlan.budget);
                    setDeliveriesPerYear(existingPlan.deliveries_per_year);
                    setYears(existingPlan.years);
                } catch (err: any) {
                    toast.error("Failed to load your saved plan.", { description: "Starting a new plan instead." });
                    navigate('/book-flow/create-flower-plan', { replace: true }); // Redirect to clean create page
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
                body: JSON.stringify({
                    budget: currentBudget,
                    deliveries_per_year: currentDeliveries,
                    years: currentYears,
                }),
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
            debouncedCalculateUpfront(bouquetBudget, deliveriesPerYear, years);
        }
        return () => {
            debouncedCalculateUpfront.cancel && debouncedCalculateUpfront.cancel();
        };
    }, [bouquetBudget, deliveriesPerYear, years, isAuthenticated, isSubmitting, isInitialLoading, debouncedCalculateUpfront]);
    
    const handleSubmit = async () => {
        if (!upfrontPrice) {
            toast.error("Please wait for the price to be calculated.");
            return;
        }
        setIsSubmitting(true);
        setError(null);

        try {
            // In update mode, we delete the old plan first to ensure a clean state
            // and re-trigger all the backend's `perform_create` logic.
            if (isUpdateMode && planId) {
                await deleteFlowerPlan(planId);
            }

            const newPlan = await createFlowerPlan({
                budget: bouquetBudget,
                deliveries_per_year: deliveriesPerYear,
                years: years,
            });

            toast.success(isUpdateMode ? "Plan updated successfully!" : "Flower plan created successfully!");
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
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="budget-slider" className="text-sm">Bouquet Budget: ${bouquetBudget}</Label>
                                <Slider id="budget-slider" aria-label="Bouquet Budget" min={75} max={500} step={5} value={[bouquetBudget]} onValueChange={(v) => {
                                    setIsDebouncePending(true);
                                    setBouquetBudget(v[0]);
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deliveries-slider" className="text-sm">Deliveries Per Year: {deliveriesPerYear}</Label>
                                <Slider id="deliveries-slider" aria-label="Deliveries Per Year" min={1} max={12} step={1} value={[deliveriesPerYear]} onValueChange={(v) => {
                                    setIsDebouncePending(true);
                                    setDeliveriesPerYear(v[0]);
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="years-slider" className="text-sm">Years: {years}</Label>
                                <Slider id="years-slider" aria-label="Years" min={1} max={25} step={1} value={[years]} onValueChange={(v) => {
                                    setIsDebouncePending(true);
                                    setYears(v[0]);
                                }} />
                            </div>
                        </div>
                        <div className="mt-4 text-center h-12 flex flex-col items-center justify-center">
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
                            {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : (isUpdateMode ? 'Save & Continue' : 'Next: Select Preferences')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
export default FlowerPlanCreationPage;
