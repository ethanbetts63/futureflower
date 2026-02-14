// futureflower/frontend/src/pages/flow/Step2RecipientPage.tsx
import React from 'react';
import RecipientEditor from '@/components/RecipientEditor';
import StepProgressBar from '@/components/StepProgressBar';
import { getUpfrontPlan, updateUpfrontPlan } from '@/api';

const Step2RecipientPage: React.FC = () => {
    return (
        <>
        <StepProgressBar currentStep={2} totalSteps={5} planName="Upfront Plan" />
        <RecipientEditor
            mode="create"
            title="Who is receiving the flowers?"
            saveButtonText="Next: Plan Preferences"
            onSaveNavigateTo="/upfront-flow/upfront-plan/{planId}/preferences"
            onCancelNavigateTo="/dashboard"
            getPlan={getUpfrontPlan}
            updatePlan={updateUpfrontPlan}
        />
        </>
    );
};

export default Step2RecipientPage;
