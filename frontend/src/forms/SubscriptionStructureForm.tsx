// futureflower/frontend/src/forms/SubscriptionStructureForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImpactTierSelector } from '@/components/form_flow/ImpactTierSelector';
import type { SubscriptionStructureFormProps } from '../types/SubscriptionStructureFormProps';
import { MIN_DAYS_BEFORE_CREATE, MIN_DAYS_BEFORE_EDIT } from '@/utils/systemConstants';

const getMinDateString = (isEdit: boolean) => {
    const minDate = new Date();
    const leadTime = isEdit ? MIN_DAYS_BEFORE_EDIT : MIN_DAYS_BEFORE_CREATE;
    minDate.setDate(minDate.getDate() + leadTime);
    return minDate.toISOString().split('T')[0];
};

const SubscriptionStructureForm: React.FC<SubscriptionStructureFormProps> = ({
    formData,
    onFormChange,
    setIsDebouncePending,
    isEdit = false
}) => {
    const handleBudgetChange = (budget: number) => {
        if (setIsDebouncePending) setIsDebouncePending(true);
        onFormChange('budget', budget);
    };

    const leadTime = isEdit ? MIN_DAYS_BEFORE_EDIT : MIN_DAYS_BEFORE_CREATE;

    return (
        <div className="space-y-6">
            <ImpactTierSelector value={formData.budget} onChange={handleBudgetChange} />

            <div className="grid gap-2">
                <Label htmlFor="frequency-select">Delivery Frequency</Label>
                <Select
                    value={formData.frequency}
                    onValueChange={(value: string) => onFormChange('frequency', value)}
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
            </div>

            <div className="grid gap-2">
                <Label htmlFor="start-date">Next Delivery Date</Label>
                <Input
                    id="start-date"
                    type="date"
                    min={getMinDateString(isEdit)}
                    value={formData.start_date}
                    onChange={(e) => onFormChange('start_date', e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Must be at least {leadTime} days from today.
                </p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="subscription-message">Message (Optional)</Label>
                <Textarea
                    id="subscription-message"
                    placeholder="e.g., Thinking of you always! This message will be used for all deliveries."
                    value={formData.subscription_message}
                    onChange={(e) => onFormChange('subscription_message', e.target.value)}
                    rows={4}
                />
            </div>
        </div>
    );
};

export default SubscriptionStructureForm;
