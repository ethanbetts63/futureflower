// frontend/src/forms/SingleDeliveryStructureForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImpactTierSelector } from '@/components/ImpactTierSelector';
import type { SingleDeliveryStructureFormProps } from '../types/SingleDeliveryStructureFormProps';

const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate.toISOString().split('T')[0];
};

const SingleDeliveryStructureForm: React.FC<SingleDeliveryStructureFormProps> = ({
    formData,
    onFormChange,
    setIsDebouncePending
}) => {
    const handleBudgetChange = (budget: number) => {
        if (setIsDebouncePending) setIsDebouncePending(true);
        onFormChange('budget', budget);
    };

    return (
        <div className="space-y-6">
            <ImpactTierSelector value={formData.budget} onChange={handleBudgetChange} />

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
