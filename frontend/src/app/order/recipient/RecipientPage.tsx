// frontend/src/app/order/recipient/RecipientPage.tsx
"use client";
import OrderRecipientEditor from '@/shared_components/form_flow/OrderRecipientEditor';
import StepProgressBar from '@/shared_components/form_flow/StepProgressBar';
import { getGuestOrder, updateGuestOrder } from '@/api/guestCheckout';

// Step 1 is the brief collected on the homepage; step 3 is the confirmation.
const RecipientPage = () => {
    return (
        <>
            <StepProgressBar currentStep={2} totalSteps={3} planName="Single Delivery Plan" />
            <OrderRecipientEditor
                mode="create"
                title="Who is receiving the flowers?"
                saveButtonText="Next: Confirm Your Order"
                onSaveNavigateTo="/order/confirmation"
                backPath="/"
                getPlan={getGuestOrder}
                updatePlan={updateGuestOrder}
            />
        </>
    );
};

export default RecipientPage;
