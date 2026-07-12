// futureflower/frontend/src/pages/user_dashboard/upfront_management/EditRecipientPage.tsx
import RecipientEditor from '@/components/form_flow/RecipientEditor';
import { getOrder, updateOrder } from '@/api/orders';

const EditRecipientPage = () => {
    return (
        <RecipientEditor
            mode="edit"
            title="Edit Recipient Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo="/dashboard/upfront-plans/{planId}/overview"
            onCancelNavigateTo="/dashboard/upfront-plans/{planId}/overview"
            getPlan={getOrder}
            updatePlan={updateOrder}
        />
    );
};

export default EditRecipientPage;
