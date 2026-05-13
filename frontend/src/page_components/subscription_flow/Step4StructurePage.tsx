// futureflower/frontend/src/pages/subscription_flow/Step4StructurePage.tsx
"use client";
import { useParams } from 'next/navigation';
import SubscriptionStructureEditor from '@/components/form_flow/SubscriptionStructureEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';

const Step4StructurePage = () => {
    const params = useParams();
    const planId = params.planId as string | undefined;

    return (
        <>
        <StepProgressBar currentStep={4} totalSteps={4} planName="Subscription Plan" />
        <SubscriptionStructureEditor
            mode="create"
            title="Define Your Subscription"
            description="Set the budget, frequency, and start date for your flower subscription. You can also add an optional message for all deliveries."
            saveButtonText="Next: Confirmation"
            onSaveNavigateTo={`/subscribe-flow/subscription-plan/${planId}/confirmation`}
            backPath={`/subscribe-flow/subscription-plan/${planId}/preferences`}
        />
        </>
    );
};

export default Step4StructurePage;
