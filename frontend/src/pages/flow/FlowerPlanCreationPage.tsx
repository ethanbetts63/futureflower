import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import Seo from '@/components/Seo';
import { toast } from 'sonner';
import { createFlowerPlan } from '@/api';
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
    
    // State for the form
    const [bouquetBudget, setBouquetBudget] = useState(75);
    const [deliveriesPerYear, setDeliveriesPerYear] = useState(1);
    const [years, setYears] = useState(5);

    // API/Calculation result state
    const [upfrontPrice, setUpfrontPrice] = useState<number | null>(null);
    const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
    const [isApiCalculating, setIsApiCalculating] = useState(false); // Renamed from isCalculating
    const [isDebouncePending, setIsDebouncePending] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to create a flower plan.");
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Memoize the core API call function to ensure debouncing works correctly
    const calculateUpfront = useCallback(async (currentBudget: number, currentDeliveries: number, currentYears: number) => {
        setIsDebouncePending(false); // Debounce has finished, API call is about to start
        setIsApiCalculating(true);
        setError(null);
        setUpfrontPrice(null); // Clear previous results immediately
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
    }, []); // Dependencies are empty as it gets values from parameters

    // Create a debounced version of the calculateUpfront function
    const debouncedCalculateUpfront = useMemo(() => {
        return debounce(calculateUpfront, 500); // 500ms debounce time
    }, [calculateUpfront]);

    // Effect to trigger initial calculation and re-calculate on slider changes
    useEffect(() => {
        // Only trigger if authenticated and not currently creating a plan
        if (isAuthenticated && !isCreating) {
            debouncedCalculateUpfront(bouquetBudget, deliveriesPerYear, years);
        }
        // Cleanup function for debounce
        return () => {
            debouncedCalculateUpfront.cancel && debouncedCalculateUpfront.cancel();
        };
    }, [bouquetBudget, deliveriesPerYear, years, isAuthenticated, isCreating, debouncedCalculateUpfront]);
    
    const handleCreatePlan = async () => {
        if (!upfrontPrice) {
            toast.error("Please calculate the price before creating the plan.");
            return;
        }
        setIsCreating(true);
        setError(null);
        try {
            const newPlan = await createFlowerPlan({
                budget: bouquetBudget,
                deliveries_per_year: deliveriesPerYear,
                years: years,
            });
            toast.success("Flower plan created successfully!");
            navigate(`/book-flow/flower-plan/${newPlan.id}/preferences`);
        } catch (err: any) {
            setError(err.message);
            toast.error("Failed to create plan:", err.message);
        } finally {
            setIsCreating(false);
        }
    }

    if (!isAuthenticated) {
        return null; // Render nothing while redirecting
    }

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title="Create Plan | ForeverFlower" />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">Create Your Flower Plan</CardTitle>
                        <CardDescription className="text-black">
                            Design your perfect long-term flower plan. Pay upfront and save!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="budget-slider" className="text-sm">Bouquet Budget: ${bouquetBudget}</Label>
                                <Slider id="budget-slider" aria-label="Bouquet Budget" min={75} max={500} step={5} value={[bouquetBudget]} onValueChange={(v) => {
                                    setIsDebouncePending(true);
                                    setBouquetBudget(v[0]);
                                    debouncedCalculateUpfront(v[0], deliveriesPerYear, years);
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deliveries-slider" className="text-sm">Deliveries Per Year: {deliveriesPerYear}</Label>
                                <Slider id="deliveries-slider" aria-label="Deliveries Per Year" min={1} max={12} step={1} value={[deliveriesPerYear]} onValueChange={(v) => {
                                    setIsDebouncePending(true);
                                    setDeliveriesPerYear(v[0]);
                                    debouncedCalculateUpfront(bouquetBudget, v[0], years);
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="years-slider" className="text-sm">Years: {years}</Label>
                                <Slider id="years-slider" aria-label="Years" min={1} max={25} step={1} value={[years]} onValueChange={(v) => {
                                    setIsDebouncePending(true);
                                    setYears(v[0]);
                                    debouncedCalculateUpfront(bouquetBudget, deliveriesPerYear, v[0]);
                                }} />
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            {/* The calculate button is removed as calculation is now automatic via debouncing */}
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
                            {error && !isCreating && <div className="text-red-500 text-sm">{error}</div>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button 
                            size="lg"
                            disabled={!upfrontPrice || isApiCalculating || isDebouncePending || isCreating}
                            onClick={handleCreatePlan}
                        >
                            {isCreating ? <Spinner className="mr-2 h-4 w-4" /> : 'Next: Select Preferences'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
export default FlowerPlanCreationPage;
