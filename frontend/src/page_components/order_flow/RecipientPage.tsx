// frontend/src/page_components/order_flow/RecipientPage.tsx
"use client";
import RecipientEditor from '@/components/form_flow/RecipientEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import { getGuestOrder, updateGuestOrder } from '@/api/guestCheckout';

// Step 1 is the brief collected on the homepage; step 3 is the confirmation.
const RecipientPage = () => {
    return (
        <>
            <StepProgressBar currentStep={2} totalSteps={3} planName="Single Delivery Plan" />
            <RecipientEditor
                mode="create"
                title="Who is receiving the flowers?"
                saveButtonText="Next: Confirm Your Order"
                onSaveNavigateTo="/order/confirmation"
                onCancelNavigateTo="/"
                getPlan={getGuestOrder}
                updatePlan={updateGuestOrder}
            />
        </>
    );
};

export default RecipientPage;
