// foreverflower/frontend/src/pages/user_dashboard/EditRecipientPage.tsx
import React from 'react';
import RecipientEditor from '@/components/RecipientEditor';

import { useParams } from 'react-router-dom';
import { getSubscriptionPlan, updateSubscriptionPlan } from '@/api/subscriptionPlans';

const EditRecipientPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <RecipientEditor
            mode="edit"
            title="Edit Recipient Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/plans/${planId}/overview`}
            onCancelNavigateTo={`/dashboard/plans/${planId}/overview`}
            getPlan={getSubscriptionPlan}
            updatePlan={updateSubscriptionPlan}
        />
    );
};

export default EditRecipientPage;
