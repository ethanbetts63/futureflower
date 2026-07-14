// frontend/src/pages/single_delivery_flow/Step2RecipientPage.tsx
"use client";
import RecipientEditor from '@/components/form_flow/RecipientEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import { getGuestOrder, updateGuestOrder } from '@/api/guestCheckout';

const Step2RecipientPage = () => {
    return (
        <>
            <StepProgressBar currentStep={2} totalSteps={3} planName="Single Delivery Plan" />
            <RecipientEditor
                mode="create"
                title="Who is receiving the flowers?"
                saveButtonText="Next: Confirm Your Order"
                onSaveNavigateTo="/single-delivery-flow/plan/{planId}/confirmation"
                onCancelNavigateTo="/"
                getPlan={getGuestOrder}
                updatePlan={updateGuestOrder}
            />
        </>
    );
};

export default Step2RecipientPage;
