// foreverflower/frontend/src/pages/user_dashboard/EditMessagesPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import MessagesEditor from '@/components/MessagesEditor';

const EditMessagesPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <MessagesEditor
            mode="edit"
            title="Edit Your Messages"
            description="Update the messages for this plan. You can use one message for all, or write a unique one for each occasion."
            saveButtonText="Save Changes"
            onSaveNavigateTo={`/dashboard/plans/${planId}/overview`}
            backPath={`/dashboard/plans/${planId}/overview`}
            showSkipButton={false}
        />
    );
};

export default EditMessagesPage;