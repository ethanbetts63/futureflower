// foreverflower/frontend/src/pages/flow/Step4CustomMessagePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import MessagesEditor from '@/components/MessagesEditor';

const Step4CustomMessagePage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();

    return (
        <MessagesEditor
            mode="create"
            title="Add Custom Messages (Optional)"
            description="Add a personal touch to each delivery. You can use one message for all, or write a unique one for each occasion."
            saveButtonText="Save & Continue"
            onSaveNavigateTo={`/book-flow/flower-plan/${planId}/confirmation`}
            backPath={`/book-flow/flower-plan/${planId}/preferences`}
            showSkipButton={true}
        />
    );
};

export default Step4CustomMessagePage;
