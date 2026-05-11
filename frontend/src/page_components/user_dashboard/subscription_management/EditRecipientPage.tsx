// futureflower/frontend/src/pages/user_dashboard/subscription_management/EditRecipientPage.tsx
import RecipientEditor from '@/components/form_flow/RecipientEditor';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api';

const EditRecipientPage = () => {
    return (
        <RecipientEditor
            mode="edit"
            title="Edit Subscription Recipient"
            saveButtonText="Save Changes"
            onSaveNavigateTo="/dashboard/subscription-plans/{planId}/overview"
            onCancelNavigateTo="/dashboard/subscription-plans/{planId}/overview"
            getPlan={getSubscriptionPlan}
            updatePlan={updateSubscriptionPlan}
        />
    );
};

export default EditRecipientPage;
