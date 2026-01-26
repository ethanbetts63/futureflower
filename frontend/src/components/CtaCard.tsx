import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { debounce } from '@/utils/debounce'; // Import debounce utility

// Define a type for the breakdown for better type safety
type Breakdown = {
  fee_per_delivery: number;
  years: number;
  deliveries_per_year: number;
  upfront_savings_percentage: number;
  // include other properties if needed
};

export const CtaCard: React.FC = () => {
  const [view, setView] = useState<'upfront' | 'subscription'>('upfront');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Shared state
  const [bouquetBudget, setBouquetBudget] = useState(75);
  const [deliveriesPerYear, setDeliveriesPerYear] = useState(1);
  
  // Upfront-only state
  const [years, setYears] = useState(5);

  // API/Calculation result state
  const [upfrontPrice, setUpfrontPrice] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Instant Calculations for Subscription view ---
  const feePerDelivery = useMemo(() => Math.max(bouquetBudget * 0.05, 15), [bouquetBudget]);
  const pricePerDelivery = useMemo(() => bouquetBudget + feePerDelivery, [bouquetBudget, feePerDelivery]);

  // --- Navigation Handler ---
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/book-flow/flower-plan');
    } else {
      navigate('/book-flow/create-account');
    }
  };

  // --- API Handler ---
  // Memoize the core API call function to ensure debouncing works correctly
  const calculateUpfront = useCallback(async (currentBudget: number, currentDeliveries: number, currentYears: number) => {
    setIsDebouncing(false); // Debounce has finished, API call is about to start
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencies are empty as it gets values from parameters

  // Create a debounced version of the calculateUpfront function
  const debouncedCalculateUpfront = useMemo(() => {
    return debounce(calculateUpfront, 500); // 500ms debounce time
  }, [calculateUpfront]);

  // Effect to trigger initial calculation and re-calculate on slider changes
  useEffect(() => {
    if (view === 'upfront') {
        debouncedCalculateUpfront(bouquetBudget, deliveriesPerYear, years);
    }
    // Cleanup function for debounce
    return () => {
        debouncedCalculateUpfront.cancel && debouncedCalculateUpfront.cancel();
    };
  }, [bouquetBudget, deliveriesPerYear, years, view, debouncedCalculateUpfront]);


  const renderUpfrontCalculator = () => (
    <>
      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="budget-slider" className="text-sm">Bouquet Budget: ${bouquetBudget}</Label>
          <Slider id="budget-slider" aria-label="Bouquet Budget" min={75} max={500} step={5} value={[bouquetBudget]} onValueChange={(v) => {
            setIsDebouncing(true);
            setBouquetBudget(v[0]);
            debouncedCalculateUpfront(v[0], deliveriesPerYear, years);
          }} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="deliveries-slider" className="text-sm">Deliveries Per Year: {deliveriesPerYear}</Label>
          <Slider id="deliveries-slider" aria-label="Deliveries Per Year" min={1} max={12} step={1} value={[deliveriesPerYear]} onValueChange={(v) => {
            setIsDebouncing(true);
            setDeliveriesPerYear(v[0]);
            debouncedCalculateUpfront(bouquetBudget, v[0], years);
          }} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="years-slider" className="text-sm">Years: {years}</Label>
          <Slider id="years-slider" aria-label="Years" min={1} max={25} step={1} value={[years]} onValueChange={(v) => {
            setIsDebouncing(true);
            setYears(v[0]);
            debouncedCalculateUpfront(bouquetBudget, deliveriesPerYear, v[0]);
          }} />
        </div>
      </div>
      <div className="mt-6 text-center">
        {/* The button is removed as calculation is now automatic via debouncing */}
      </div>
      <div className="mt-4 text-center h-20 flex flex-col items-center justify-center">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {(isLoading || isDebouncing) ? (
            <Spinner className="h-8 w-8" />
        ) : (
            upfrontPrice !== null && (
            <>
                <div className="text-2xl font-bold">${upfrontPrice.toLocaleString()}</div>
                {breakdown?.upfront_savings_percentage && <p className="text-xs text-gray-600 mb-2">That's a ~{breakdown.upfront_savings_percentage}% savings compared to paying per delivery!</p>}
                <Button onClick={handleGetStarted} className="mt-2">Get Started</Button>
            </>
            )
        )}
      </div>
    </>
  );

  const renderSubscriptionCalculator = () => (
    <>
      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="budget-slider-sub" className="text-sm">Bouquet Budget: ${bouquetBudget}</Label>
          <Slider id="budget-slider-sub" aria-label="Bouquet Budget" min={75} max={500} step={5} value={[bouquetBudget]} onValueChange={(v) => setBouquetBudget(v[0])} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="deliveries-slider-sub" className="text-sm">Deliveries Per Year: {deliveriesPerYear}</Label>
          <Slider id="deliveries-slider-sub" aria-label="Deliveries Per Year" min={1} max={12} step={1} value={[deliveriesPerYear]} onValueChange={(v) => setDeliveriesPerYear(v[0])} />
        </div>
      </div>
       <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <Label className="text-sm text-gray-600">Price Per Delivery</Label>
        <div className="text-2xl font-bold mt-1">${pricePerDelivery.toFixed(2)}</div>
        <p className="text-xs text-gray-600 mt-2">Planning for {years} years or more? Switch to 'Pay Upfront' to save on the total cost.</p>
        <Button onClick={handleGetStarted} className="mt-4">Get Started</Button>
       </div>
    </>
  );

  return (
    <Card className="w-full bg-white shadow-md text-gray-900 rounded-none sm:rounded-xl border-0">
      <CardHeader className="p-4 text-center">
        <h2 className="font-bold text-3xl italic text-black font-['Playfair_Display',_serif] mb-4">
          FOREVERFLOWER
        </h2>
        <div className="flex justify-center bg-muted p-1 rounded-md">
          <button onClick={() => setView('upfront')} className={`w-1/2 px-4 py-2 text-sm font-bold rounded ${view === 'upfront' ? 'bg-primary text-primary-foreground' : 'text-black'}`}>Pay Upfront</button>
          <button onClick={() => setView('subscription')} className={`w-1/2 px-4 py-2 text-sm font-bold rounded ${view === 'subscription' ? 'bg-primary text-primary-foreground' : 'text-black'}`}>Subscription</button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-black">
        {view === 'upfront' ? renderUpfrontCalculator() : renderSubscriptionCalculator()}
      </CardContent>
    </Card>
  );
};