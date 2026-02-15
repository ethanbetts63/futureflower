// frontend/src/pages/single_delivery_flow/Step3PreferencesPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/form_flow/PreferencesEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import { getUpfrontPlanAsSingleDelivery, updateUpfrontPlanAsSingleDelivery } from '@/api/singleDeliveryPlans';

const Step3PreferencesPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <>
        <StepProgressBar currentStep={3} totalSteps={4} planName="Single Delivery Plan" />
        <PreferencesEditor
            mode="create"
            saveButtonText="Next: Details"
            onSaveNavigateTo={`/single-delivery-flow/plan/${planId}/structure`}
            backPath={`/single-delivery-flow/plan/${planId}/recipient`}
            getPlan={getUpfrontPlanAsSingleDelivery}
            updatePlan={updateUpfrontPlanAsSingleDelivery}
        />
        </>
    );
};

export default Step3PreferencesPage;
