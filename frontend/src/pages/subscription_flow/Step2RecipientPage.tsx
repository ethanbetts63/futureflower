import React from 'react';
import RecipientEditor from '@/components/form_flow/RecipientEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api';

const Step2RecipientPage: React.FC = () => {
    return (
        <>
        <StepProgressBar currentStep={2} totalSteps={4} planName="Subscription Plan" />
        <RecipientEditor
            mode="create"
            title="Who will be receiving the flowers?"
            saveButtonText="Next: Plan Preferences"
            onSaveNavigateTo="/subscribe-flow/subscription-plan/{planId}/preferences"
            onCancelNavigateTo="/order"
            getPlan={getSubscriptionPlan}
            updatePlan={updateSubscriptionPlan}
        />
        </>
    );
};

export default Step2RecipientPage;
