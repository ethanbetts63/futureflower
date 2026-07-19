// frontend/src/app/order/recipient/RecipientPage.tsx
"use client";
import GuestRecipientEditor from '@/app/order/recipient/GuestRecipientEditor';
import StepProgressBar from '@/shared_components/form_flow/StepProgressBar';

// Step 1 is the brief collected on the homepage; step 3 is the details page.
const RecipientPage = () => {
    return (
        <>
            <StepProgressBar currentStep={2} totalSteps={3} planName="Single Delivery Plan" />
            <GuestRecipientEditor />
        </>
    );
};

export default RecipientPage;
