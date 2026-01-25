// foreverflower/frontend/src/components/PlanStructureForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export interface PlanStructureData {
  budget: number;
  deliveries_per_year: number;
  years: number;
}

interface PlanStructureFormProps {
  formData: PlanStructureData;
  onFormChange: (field: keyof PlanStructureData, value: number) => void;
  setIsDebouncePending?: (isPending: boolean) => void;
  title?: string;
}

const PlanStructureForm: React.FC<PlanStructureFormProps> = ({
  formData,
  onFormChange,
  setIsDebouncePending,
  title = "Plan Structure"
}) => {

  const handleSliderChange = (field: keyof PlanStructureData) => (value: number[]) => {
    if (setIsDebouncePending) {
      setIsDebouncePending(true);
    }
    onFormChange(field, value[0]);
  };

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
        </div>
      </div>
    </div>
  );
};

export default PlanStructureForm;
