// foreverflower/frontend/src/pages/user_dashboard/EditRecipientPage.tsx
import React from 'react';
import RecipientEditor from '@/components/RecipientEditor';

const EditRecipientPage: React.FC = () => {
    return (
        <RecipientEditor
            mode="edit"
            title="Edit Recipient Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo="/dashboard/plans/{planId}/overview"
            onCancelNavigateTo="/dashboard/plans/{planId}/overview"
        />
    );
};

export default EditRecipientPage;
