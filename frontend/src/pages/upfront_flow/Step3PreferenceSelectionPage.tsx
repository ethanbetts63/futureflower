// futureflower/frontend/src/pages/flow/Step3PreferenceSelectionPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PreferencesEditor from '@/components/form_flow/PreferencesEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import { getUpfrontPlan, updateUpfrontPlan } from '@/api';

const Step3PreferenceSelectionPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <>
        <StepProgressBar currentStep={3} totalSteps={5} planName="Upfront Plan" />
        <PreferencesEditor
            mode="create"
            title="The Florist's Brief"
            description="Set the vibe and give your florist the inside scoop. This step is optional but it makes a difference."
            saveButtonText="Save & Continue"
            onSaveNavigateTo={`/upfront-flow/upfront-plan/${planId}/add-message`}
            backPath={`/upfront-flow/upfront-plan/${planId}/structure`}
            showSkipButton={true}
            getPlan={getUpfrontPlan}
            updatePlan={updateUpfrontPlan}
        />
        </>
    );
};

export default Step3PreferenceSelectionPage;