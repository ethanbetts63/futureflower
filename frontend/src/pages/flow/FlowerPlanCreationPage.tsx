import React, { useState, useEffect } from 'react';
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
    const [isCalculating, setIsCalculating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to create a flower plan.");
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleCalculateUpfront = async () => {
        setIsCalculating(true);
        setError(null);
        setUpfrontPrice(null);
        setBreakdown(null);

        try {
            // NOTE: Using fetch here because this is an unauthenticated call by design
            const response = await fetch('/api/events/calculate-price/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bouquet_budget: bouquetBudget,
                    deliveries_per_year: deliveriesPerYear,
                    years: years,
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
            setIsCalculating(false);
        }
    };
    
    const handleCreatePlan = async () => {
        if (!upfrontPrice) {
            toast.error("Please calculate the price before creating the plan.");
            return;
        }
        setIsCreating(true);
        setError(null);
        try {
            const newPlan = await createFlowerPlan({
                bouquet_budget: bouquetBudget,
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

    const isLoading = isCalculating || isCreating;

    return (
        <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--color4)' }}>
            <div className="container mx-auto max-w-2xl py-12">
                <Seo title="Create Plan | ForeverFlower" />
                <Card className="bg-white text-black border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-3xl">Step 2: Create Your Flower Plan</CardTitle>
                        <CardDescription className="text-black">
                            Design your perfect long-term flower plan. Pay upfront and save!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="budget-slider" className="text-sm">Bouquet Budget: ${bouquetBudget}</Label>
                                <Slider id="budget-slider" aria-label="Bouquet Budget" min={75} max={500} step={5} value={[bouquetBudget]} onValueChange={(v) => setBouquetBudget(v[0])} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deliveries-slider" className="text-sm">Deliveries Per Year: {deliveriesPerYear}</Label>
                                <Slider id="deliveries-slider" aria-label="Deliveries Per Year" min={1} max={12} step={1} value={[deliveriesPerYear]} onValueChange={(v) => setDeliveriesPerYear(v[0])} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="years-slider" className="text-sm">Years: {years}</Label>
                                <Slider id="years-slider" aria-label="Years" min={1} max={25} step={1} value={[years]} onValueChange={(v) => setYears(v[0])} />
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <Button onClick={handleCalculateUpfront} disabled={isLoading} className="w-full">{isCalculating ? <Spinner className="mr-2 h-4 w-4" /> : 'Calculate Upfront Cost'}</Button>
                        </div>
                        <div className="mt-4 text-center h-12 flex flex-col items-center justify-center">
                            {upfrontPrice !== null && (
                            <>
                                <div className="text-2xl font-bold">${upfrontPrice.toLocaleString()}</div>
                                {breakdown?.upfront_savings_percentage && <p className="text-xs text-gray-600">That's a ~{breakdown.upfront_savings_percentage}% savings compared to paying per delivery!</p>}
                            </>
                            )}
                            {error && !isCreating && <div className="text-red-500 text-sm">{error}</div>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button 
                            size="lg"
                            disabled={!upfrontPrice || isLoading}
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
