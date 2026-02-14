// futureflower/frontend/src/pages/flow/Step4CustomMessagePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import MessagesEditor from '@/components/form_flow/MessagesEditor';
import StepProgressBar from '@/components/StepProgressBar';

const Step4CustomMessagePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <>
        <StepProgressBar currentStep={4} totalSteps={5} planName="Upfront Plan" />
        <MessagesEditor
            mode="create"
            title="Add Custom Messages (Optional)"
            description="Add a personal touch to each delivery. You can use one message for all, or write a unique one for each occasion."
            saveButtonText="Save & Continue"
            onSaveNavigateTo={`/upfront-flow/upfront-plan/${planId}/structure`}
            backPath={`/upfront-flow/upfront-plan/${planId}/preferences`}
            showSkipButton={true}
        />
        </>
    );
};

export default Step4CustomMessagePage;
