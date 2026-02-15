// frontend/src/pages/single_delivery_flow/Step2RecipientPage.tsx
import React from 'react';
import RecipientEditor from '@/components/form_flow/RecipientEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import { getUpfrontPlanAsSingleDelivery, updateUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';

const Step2RecipientPage: React.FC = () => {
    return (
        <>
            <StepProgressBar currentStep={2} totalSteps={4} planName="Single Delivery Plan" />
            <RecipientEditor
                mode="create"
                title="Who is receiving the flowers?"
                saveButtonText="Next: Plan Preferences"
                onSaveNavigateTo="/single-delivery-flow/plan/{planId}/preferences"
                onCancelNavigateTo="/order"
                getPlan={getUpfrontPlanAsSingleDelivery}
                updatePlan={updateUpfrontPlanAsSingleDelivery}
            />
        </>
    );
};

export default Step2RecipientPage;
