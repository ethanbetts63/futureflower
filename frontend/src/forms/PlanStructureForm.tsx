import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImpactTierSelector } from '@/components/form_flow/ImpactTierSelector';
import { MIN_DAYS_BEFORE_FIRST_DELIVERY } from '@/utils/systemConstants';

import type { PlanStructureFormProps } from '../types/PlanStructureFormProps';

const PlanStructureForm: React.FC<PlanStructureFormProps> = ({
  formData,
  onFormChange,
  setIsDebouncePending,
  title = "Plan Structure"
}) => {

  const handleBudgetChange = (budget: number) => {
    if (setIsDebouncePending) {
      setIsDebouncePending(true);
    }
    onFormChange('budget', budget);
  };

  const handleSliderChange = (field: 'years') => (value: number[]) => {
    if (setIsDebouncePending) {
      setIsDebouncePending(true);
    }
    onFormChange(field, value[0]);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + MIN_DAYS_BEFORE_FIRST_DELIVERY);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-6">
        <ImpactTierSelector value={formData.budget} onChange={handleBudgetChange} />

        <div className="grid gap-2">
          <Label htmlFor="frequency-select" className="text-sm">Delivery Frequency</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value: string) => {
              if (setIsDebouncePending) {
                setIsDebouncePending(true);
              }
              onFormChange('frequency', value);
            }}
          >
            <SelectTrigger id="frequency-select">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="fortnightly">Fortnightly (every 2 weeks)</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly (every 3 months)</SelectItem>
              <SelectItem value="bi-annually">Bi-Annually (every 6 months)</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">Choose how often bouquets are delivered.</p>
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
