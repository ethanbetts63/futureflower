// frontend/src/forms/SingleDeliveryStructureForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImpactTierSelector } from '@/components/form_flow/ImpactTierSelector';
import type { SingleDeliveryStructureFormProps } from '../types/SingleDeliveryStructureFormProps';
import { MIN_DAYS_BEFORE_CREATE, MIN_DAYS_BEFORE_EDIT } from '@/utils/systemConstants';

const getMinDateString = (isEdit: boolean) => {
    const minDate = new Date();
    const leadTime = isEdit ? MIN_DAYS_BEFORE_EDIT : MIN_DAYS_BEFORE_CREATE;
    minDate.setDate(minDate.getDate() + leadTime);
    return minDate.toISOString().split('T')[0];
};

const SingleDeliveryStructureForm: React.FC<SingleDeliveryStructureFormProps> = ({
    formData,
    onFormChange,
    setIsDebouncePending,
    isEdit = false,
    isPaid = false,
}) => {
    const handleBudgetChange = (budget: number) => {
        if (setIsDebouncePending) setIsDebouncePending(true);
        onFormChange('budget', budget);
    };

    const leadTime = isEdit ? MIN_DAYS_BEFORE_EDIT : MIN_DAYS_BEFORE_CREATE;

    return (
        <div className="space-y-6">
            {!isPaid && <ImpactTierSelector value={formData.budget} onChange={handleBudgetChange} />}

            <div className="grid gap-2">
                <Label htmlFor="start-date">Delivery Date</Label>
                <Input
                    id="start-date"
                    type="date"
                    min={getMinDateString(isEdit)}
                    value={formData.start_date}
                    onChange={(e) => onFormChange('start_date', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                    The date the bouquet will be delivered. Must be at least {leadTime} days from today.
                </p>
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
