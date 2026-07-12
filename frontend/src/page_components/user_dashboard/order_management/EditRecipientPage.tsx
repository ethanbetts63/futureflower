// futureflower/frontend/src/page_components/user_dashboard/order_management/EditRecipientPage.tsx
import RecipientEditor from '@/components/form_flow/RecipientEditor';
import { getOrder, updateOrder } from '@/api/orders';

const EditRecipientPage = () => {
    return (
        <RecipientEditor
            mode="edit"
            title="Edit Recipient Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo="/dashboard/orders/{planId}/overview"
            onCancelNavigateTo="/dashboard/orders/{planId}/overview"
            getPlan={getOrder}
            updatePlan={updateOrder}
        />
    );
};

export default EditRecipientPage;
