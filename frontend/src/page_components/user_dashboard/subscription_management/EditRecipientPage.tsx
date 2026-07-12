// futureflower/frontend/src/pages/user_dashboard/subscription_management/EditRecipientPage.tsx
import RecipientEditor from '@/components/form_flow/RecipientEditor';
import { getOrder, updateOrder } from '@/api/orders';

const EditRecipientPage = () => {
    return (
        <RecipientEditor
            mode="edit"
            title="Edit Subscription Recipient"
            saveButtonText="Save Changes"
            onSaveNavigateTo="/dashboard/subscription-plans/{planId}/overview"
            onCancelNavigateTo="/dashboard/subscription-plans/{planId}/overview"
            getPlan={getOrder}
            updatePlan={updateOrder}
        />
    );
};

export default EditRecipientPage;
