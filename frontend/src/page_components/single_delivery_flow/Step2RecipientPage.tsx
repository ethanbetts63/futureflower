// frontend/src/pages/single_delivery_flow/Step2RecipientPage.tsx
import RecipientEditor from '@/components/form_flow/RecipientEditor';
import StepProgressBar from '@/components/form_flow/StepProgressBar';
import { getOrder, updateOrder } from '@/api/orders';

const Step2RecipientPage = () => {
    return (
        <>
            <StepProgressBar currentStep={2} totalSteps={4} planName="Single Delivery Plan" />
            <RecipientEditor
                mode="create"
                title="Who is receiving the flowers?"
                saveButtonText="Next: Delivery Details"
                onSaveNavigateTo="/single-delivery-flow/plan/{planId}/structure"
                onCancelNavigateTo="/"
                getPlan={getOrder}
                updatePlan={updateOrder}
            />
        </>
    );
};

export default Step2RecipientPage;
