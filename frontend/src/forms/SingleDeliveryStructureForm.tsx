import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

import type { SingleDeliveryStructureFormProps } from '../types/SingleDeliveryStructureFormProps';

const SingleDeliveryStructureForm: React.FC<SingleDeliveryStructureFormProps> = ({
  formData,
  onFormChange,
  title = "One-Time Bouquet Details"
}) => {

  const handleBudgetSliderChange = (value: number[]) => {
    onFormChange('budget', value[0]);
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
            onValueChange={handleBudgetSliderChange}
          />
          <p className="text-sm text-gray-500 mt-1">Adjust the budget for this single bouquet (inc. delivery & tax).</p>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="start-date-input" className="text-sm">Delivery Date</Label>
            <Input
                id="start-date-input"
                type="date"
                min={minDateString}
                value={formData.start_date || ''}
                onChange={(e) => onFormChange('start_date', e.target.value)}
                className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">Select the date for the bouquet delivery. Must be at least 7 days from today.</p>
        </div>

        <div className="grid gap-2">
            <Label htmlFor="preferred-delivery-time" className="text-sm">Preferred Delivery Time (optional)</Label>
            <Input
                id="preferred-delivery-time"
                type="text"
                placeholder="e.g., Morning, 10 AM - 12 PM"
                value={formData.preferred_delivery_time || ''}
                onChange={(e) => onFormChange('preferred_delivery_time', e.target.value)}
                className="w-full"
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="delivery-notes" className="text-sm">Delivery Notes (optional)</Label>
            <Textarea
                id="delivery-notes"
                placeholder="e.g., Leave with concierge, knock loudly, do not leave on porch if raining."
                value={formData.delivery_notes || ''}
                onChange={(e) => onFormChange('delivery_notes', e.target.value)}
                rows={3}
                className="w-full"
            />
        </div>
      </div>
    </div>
  );
};

export default SingleDeliveryStructureForm;
