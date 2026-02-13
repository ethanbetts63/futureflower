// frontend/src/forms/SingleDeliveryStructureForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import type { SingleDeliveryStructureFormProps } from '../types/SingleDeliveryStructureFormProps';

const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7); // At least 7 days in the future
    return minDate.toISOString().split('T')[0];
};

const SingleDeliveryStructureForm: React.FC<SingleDeliveryStructureFormProps> = ({
    formData,
    onFormChange,
    setIsDebouncePending
}) => {
    const handleSliderChange = (value: number[]) => {
        if (setIsDebouncePending) setIsDebouncePending(true);
        onFormChange('budget', value[0]);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="budget-slider">Bouquet Budget: ${formData.budget}</Label>
                <Slider
                    id="budget-slider"
                    aria-label="Bouquet Budget"
                    min={75}
                    max={500}
                    step={5}
                    value={[formData.budget]}
                    onValueChange={handleSliderChange}
                />
                 <p className="text-sm text-muted-foreground">The cost of the flowers for the bouquet.</p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="start-date">Delivery Date</Label>
                <Input
                    id="start-date"
                    type="date"
                    min={getMinDateString()}
                    value={formData.start_date}
                    onChange={(e) => onFormChange('start_date', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">The date the bouquet will be delivered.</p>
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="card-message">Card Message</Label>
                <Textarea
                    id="card-message"
                    placeholder="e.g., Happy Birthday! Hope you have a wonderful day."
                    value={formData.card_message}
                    onChange={(e) => onFormChange('card_message', e.target.value)}
                    rows={4}
                />
                <p className="text-sm text-muted-foreground">The message to be included with the delivery.</p>
            </div>
        </div>
    );
};

export default SingleDeliveryStructureForm;