// frontend/src/pages/single_delivery_flow/Step2RecipientPage.tsx
import React from 'react';
import RecipientEditor from '@/components/RecipientEditor';
import { getSingleDeliveryPlan, updateSingleDeliveryPlan } from '@/api';

const Step2RecipientPage: React.FC = () => {
    return (
        <RecipientEditor
            mode="create"
            title="Who is receiving the flowers?"
            saveButtonText="Next: Plan Preferences"
            onSaveNavigateTo="/single-delivery-flow/plan/{planId}/preferences"
            onCancelNavigateTo="/dashboard"
            getPlan={getSingleDeliveryPlan}
            updatePlan={updateSingleDeliveryPlan}
        />
    );
};

export default Step2RecipientPage;
