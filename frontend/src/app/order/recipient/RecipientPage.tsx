"use client";
import GuestRecipientEditor from '@/app/order/recipient/GuestRecipientEditor';
import StepProgressBar from '@/shared_components/form_flow/StepProgressBar';

const RecipientPage = () => {
    return (
        <>
            <StepProgressBar currentStep={2} totalSteps={3} planName="Single Delivery Plan" />
            <GuestRecipientEditor />
        </>
    );
};

export default RecipientPage;
