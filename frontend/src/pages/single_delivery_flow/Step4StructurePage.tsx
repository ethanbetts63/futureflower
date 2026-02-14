// frontend/src/pages/single_delivery_flow/Step4StructurePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import SingleDeliveryStructureEditor from '@/components/form_flow/SingleDeliveryStructureEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';

const Step4StructurePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <>
        <StepProgressBar currentStep={4} totalSteps={4} planName="Single Delivery Plan" />
        <SingleDeliveryStructureEditor
            mode="create"
            title="Delivery Details"
            description="Set the budget for the bouquet, when it should be delivered, and an optional message."
            saveButtonText="Next: Confirm Your Order"
            onSaveNavigateTo={`/single-delivery-flow/plan/${planId}/confirmation`}
            backPath={`/single-delivery-flow/plan/${planId}/preferences`}
        />
        </>
    );
};

export default Step4StructurePage;
