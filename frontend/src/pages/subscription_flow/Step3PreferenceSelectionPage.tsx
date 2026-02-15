import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/form_flow/PreferencesEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api';

const Step3PreferenceSelectionPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <>
        <StepProgressBar currentStep={3} totalSteps={4} planName="Subscription Plan" />
        <PreferencesEditor
            mode="create"
            saveButtonText="Save & Continue"
            onSaveNavigateTo={`/subscribe-flow/subscription-plan/${planId}/structure`}
            backPath={`/subscribe-flow/subscription-plan/${planId}/recipient`}
            getPlan={getSubscriptionPlan}
            updatePlan={updateSubscriptionPlan}
        />
        </>
    );
};

export default Step3PreferenceSelectionPage;
