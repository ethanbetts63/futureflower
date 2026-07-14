// frontend/src/pages/single_delivery_flow/Step3PreferencesPage.tsx
"use client";
import { useParams } from 'next/navigation';
import PreferencesEditor from '@/components/form_flow/PreferencesEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import { getGuestOrder, updateGuestOrder } from '@/api/guestCheckout';

const Step3PreferencesPage = () => {
    const params = useParams();
    const planId = params.planId as string | undefined;

    return (
        <>
        <StepProgressBar currentStep={3} totalSteps={4} planName="Single Delivery Plan" />
        <PreferencesEditor
            mode="create"
            saveButtonText="Next: Details"
            onSaveNavigateTo={`/single-delivery-flow/plan/${planId}/structure`}
            backPath={`/single-delivery-flow/plan/${planId}/recipient`}
            getPlan={getGuestOrder}
            updatePlan={updateGuestOrder}
        />
        </>
    );
};

export default Step3PreferencesPage;
