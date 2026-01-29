import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

import type { PlanStructureFormProps } from '../types/PlanStructureFormProps';

const PlanStructureForm: React.FC<PlanStructureFormProps> = ({
  formData,
  onFormChange,
  setIsDebouncePending,
  title = "Plan Structure"
}) => {

  const handleSliderChange = (field: 'budget' | 'deliveries_per_year' | 'years') => (value: number[]) => {
    if (setIsDebouncePending) {
      setIsDebouncePending(true);
    }
    onFormChange(field, value[0]);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 7);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="budget-slider" className="text-sm">Bouquet Budget: ${formData.budget}</Label>
          <Slider
            id="budget-slider"
            aria-label="Bouquet Budget"
            min={75}
            max={500}
            step={5}
            value={[formData.budget]}
            onValueChange={handleSliderChange('budget')}
          />
          <p className="text-sm text-gray-500 mt-1">Adjust the budget for each individual bouquet (inc. delivery & tax).</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="deliveries-slider" className="text-sm">Deliveries Per Year: {formData.deliveries_per_year}</Label>
          <Slider
            id="deliveries-slider"
            aria-label="Deliveries Per Year"
            min={1}
            max={12}
            step={1}
            value={[formData.deliveries_per_year]}
            onValueChange={handleSliderChange('deliveries_per_year')}
          />
          <p className="text-sm text-gray-500 mt-1">Adjust how many bouquets are delivered per year. Delivery dates will be evenly spaced from your first delivery date.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="years-slider" className="text-sm">Years: {formData.years}</Label>
          <Slider
            id="years-slider"
            aria-label="Years"
            min={1}
            max={25}
            step={1}
            value={[formData.years]}
            onValueChange={handleSliderChange('years')}
          />
          <p className="text-sm text-gray-500 mt-1">Adjust the total duration of the plan in years.</p>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="start-date-input" className="text-sm">First Delivery Date</Label>
            <Input
                id="start-date-input"
                type="date"
                min={minDateString}
                value={formData.start_date || ''}
                onChange={(e) => onFormChange('start_date', e.target.value)}
                className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Select the date for the first bouquet delivery. Must be at least 7 days from today.</p>
        </div>
      </div>
    </div>
  );
};

export default PlanStructureForm;
