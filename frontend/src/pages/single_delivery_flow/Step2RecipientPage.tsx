// frontend/src/pages/single_delivery_flow/Step2RecipientPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import RecipientEditor from '@/components/RecipientEditor';
import { getSingleDeliveryPlan, updateSingleDeliveryPlan } from '@/api';

const Step2RecipientPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <RecipientEditor
            mode="create"
            title="Who is this for?"
            saveButtonText="Next: Preferences"
            onSaveNavigateTo={`/single-delivery-flow/plan/${planId}/preferences`}
            onCancelNavigateTo="/dashboard"
            getPlan={getSingleDeliveryPlan}
            updatePlan={updateSingleDeliveryPlan}
        />
    );
};

export default Step2RecipientPage;
