// foreverflower/frontend/src/pages/user_dashboard/EditRecipientPage.tsx
import React from 'react';
import RecipientEngine from '@/components/RecipientEngine';

const EditRecipientPage: React.FC = () => {
    return (
        <RecipientEngine
            mode="edit"
            title="Edit Recipient Details"
            saveButtonText="Save Changes"
            onSaveNavigateTo="/dashboard/plans/{planId}/overview"
            onCancelNavigateTo="/dashboard/plans/{planId}/overview"
        />
    );
};

export default EditRecipientPage;
