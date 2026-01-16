import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export const PriceCalculator: React.FC = () => {
  const [bouquetBudget, setBouquetBudget] = useState(75);
  const [deliveriesPerYear, setDeliveriesPerYear] = useState(1);
  const [years, setYears] = useState(5);

  const [upfrontPrice, setUpfrontPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);
    setUpfrontPrice(null);

    try {
      const response = await fetch('/api/events/calculate-price/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: Add CSRF token if needed by your Django setup
        },
        body: JSON.stringify({
          bouquet_budget: bouquetBudget,
          deliveries_per_year: deliveriesPerYear,
          years: years,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setUpfrontPrice(data.upfront_price);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-lg max-w-2xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-6 text-center">Estimate Your Cost</h2>
      
      <div className="space-y-8">
        {/* Bouquet Budget Slider */}
        <div className="grid gap-2">
          <Label htmlFor="budget-slider">Bouquet Budget: ${bouquetBudget}</Label>
          <Slider
            id="budget-slider"
            min={75}
            max={500}
            step={5}
            value={[bouquetBudget]}
            onValueChange={(value) => setBouquetBudget(value[0])}
          />
        </div>

        {/* Deliveries Per Year Slider */}
        <div className="grid gap-2">
          <Label htmlFor="deliveries-slider">Deliveries Per Year: {deliveriesPerYear}</Label>
          <Slider
            id="deliveries-slider"
            min={1}
            max={12}
            step={1}
            value={[deliveriesPerYear]}
            onValueChange={(value) => setDeliveriesPerYear(value[0])}
          />
        </div>

        {/* Years Slider */}
        <div className="grid gap-2">
          <Label htmlFor="years-slider">Years: {years}</Label>
          <Slider
            id="years-slider"
            min={1}
            max={25}
            step={1}
            value={[years]}
            onValueChange={(value) => setYears(value[0])}
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={handleCalculate} disabled={isLoading}>
          {isLoading ? 'Calculating...' : 'Calculate Upfront Cost'}
        </Button>
      </div>

      <div className="mt-6 text-center">
        {upfrontPrice !== null && (
          <div className="text-3xl font-bold">
            Estimated Upfront Price: ${upfrontPrice.toLocaleString()}
          </div>
        )}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
};
