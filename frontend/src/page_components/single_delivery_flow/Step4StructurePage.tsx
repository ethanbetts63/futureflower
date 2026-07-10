// frontend/src/pages/single_delivery_flow/Step4StructurePage.tsx
"use client";
import { useParams } from 'next/navigation';
import SingleDeliveryStructureEditor from '@/components/form_flow/SingleDeliveryStructureEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';

const Step4StructurePage = () => {
    const params = useParams();
    const planId = params.planId as string | undefined;

    return (
        <>
        <StepProgressBar currentStep={3} totalSteps={4} planName="Single Delivery Plan" />
        <SingleDeliveryStructureEditor
            mode="create"
            saveButtonText="Next: Confirm Your Order"
            onSaveNavigateTo={`/single-delivery-flow/plan/${planId}/confirmation`}
            backPath={`/single-delivery-flow/plan/${planId}/recipient`}
        />
        </>
    );
};

export default Step4StructurePage;
