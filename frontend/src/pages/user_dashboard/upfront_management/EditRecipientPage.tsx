// foreverflower/frontend/src/pages/user_dashboard/upfront_management/EditRecipientPage.tsx
import React from 'react';
import RecipientEditor from '@/components/RecipientEditor';
import { getUpfrontPlan, updateUpfrontPlan } from '@/api';

const EditRecipientPage: React.FC = () => {
    return (
        <RecipientEditor
            mode="edit"
            title="Edit Recipient Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo="/dashboard/plans/{planId}/overview"
            onCancelNavigateTo="/dashboard/plans/{planId}/overview"
            getPlan={getUpfrontPlan}
            updatePlan={updateUpfrontPlan}
        />
    );
};

export default EditRecipientPage;
