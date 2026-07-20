import GuestRecipientEditor from '@/app/order/recipient/GuestRecipientEditor';
import StepProgressBar from '@/shared_components/form_flow/StepProgressBar';
import type { Order } from '@/types/Order';

const RecipientPage = ({ initialOrder }: { initialOrder: Order }) => {
    return (
        <>
            <StepProgressBar currentStep={2} totalSteps={3} planName="Single Delivery Plan" />
            <GuestRecipientEditor initialOrder={initialOrder} />
        </>
    );
};

export default RecipientPage;
